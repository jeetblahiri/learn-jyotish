import { Body, Ecliptic, GeoVector, SiderealTime } from "astronomy-engine";
import { nakshatraAt } from "./nakshatra";
import type { AyanamshaId, CalculationSettings, ClassicalPlanet, JyotishChart, PlanetPosition } from "./types";
import { allSupportedVargas, normalizeDegrees } from "./vargas";

export const DEFAULT_CALCULATION_SETTINGS: CalculationSettings = {
  ayanamsha: "lahiri",
  nodeMode: "mean",
  houseSystem: "whole-sign",
  zodiac: "sidereal",
};

export const AYANAMSHA_METADATA: Record<AyanamshaId, { label: string; exact: boolean; note: string }> = {
  lahiri: { label: "Lahiri / Chitrapaksha", exact: false, note: "Educational polynomial approximation; validate against a Swiss Ephemeris implementation for consultation-grade work." },
  "raman-approx": { label: "Raman (approximate)", exact: false, note: "Approximate offset from the educational Lahiri model; intended for comparison learning only." },
  "kp-approx": { label: "Krishnamurti (approximate)", exact: false, note: "Approximate KP offset; intended for comparison learning only." },
};

const BODY_MAP: Array<{ name: ClassicalPlanet; body: Body }> = [
  { name: "Sun", body: Body.Sun }, { name: "Moon", body: Body.Moon }, { name: "Mercury", body: Body.Mercury },
  { name: "Venus", body: Body.Venus }, { name: "Mars", body: Body.Mars }, { name: "Jupiter", body: Body.Jupiter },
  { name: "Saturn", body: Body.Saturn },
];

function decimalYear(date: Date): number {
  const year = date.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return year + (date.getTime() - start) / (end - start);
}

/** Educational comparison model, not a replacement for Swiss Ephemeris. */
export function ayanamshaDegrees(date: Date, mode: AyanamshaId = "lahiri"): number {
  const years = decimalYear(date) - 2000;
  const lahiri = 23.85675 + years * 0.0139687;
  if (mode === "raman-approx") return lahiri - 1.485;
  if (mode === "kp-approx") return lahiri - 0.096;
  return lahiri;
}

export function signedAngularDelta(to: number, from: number): number {
  return ((to - from + 540) % 360) - 180;
}

function tropicalLongitude(body: Body, date: Date): number {
  return normalizeDegrees(Ecliptic(GeoVector(body, date, true)).elon);
}

export function ascendantLongitude(date: Date, latitude: number, longitude: number, ayanamsha: number): number {
  const localSiderealRadians = ((SiderealTime(date) + longitude / 15) * 15 * Math.PI) / 180;
  const latitudeRadians = latitude * Math.PI / 180;
  const obliquity = 23.4392911 * Math.PI / 180;
  const tropical = Math.atan2(
    Math.cos(localSiderealRadians),
    -(Math.sin(localSiderealRadians) * Math.cos(obliquity) + Math.tan(latitudeRadians) * Math.sin(obliquity)),
  ) * 180 / Math.PI;
  return normalizeDegrees(tropical - ayanamsha);
}

function meanNodeTropical(date: Date): number {
  const daysSinceJ2000 = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86_400_000;
  return normalizeDegrees(125.04452 - 0.0529538083 * daysSinceJ2000);
}

function positionRecord(
  name: PlanetPosition["name"], siderealLongitude: number, tropical: number | undefined,
  speed: number, ascendantSign: number,
): PlanetPosition {
  const sign = Math.floor(normalizeDegrees(siderealLongitude) / 30);
  return {
    name,
    longitude: normalizeDegrees(siderealLongitude),
    tropicalLongitude: tropical,
    sign,
    degree: normalizeDegrees(siderealLongitude) % 30,
    house: ((sign - ascendantSign + 12) % 12) + 1,
    speed,
    retrograde: speed < 0,
    nakshatra: nakshatraAt(siderealLongitude),
    vargas: allSupportedVargas(siderealLongitude),
  };
}

export interface ChartCalculationInput {
  date: Date;
  latitude: number;
  longitude: number;
  settings?: Partial<CalculationSettings>;
  fixedAscendantSign?: number;
}

export function calculateChart(input: ChartCalculationInput): JyotishChart {
  if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90) throw new RangeError("Latitude must be between -90 and 90 degrees.");
  if (!Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180) throw new RangeError("Longitude must be between -180 and 180 degrees.");
  if (Number.isNaN(input.date.getTime())) throw new RangeError("A valid date is required.");
  const settings = { ...DEFAULT_CALCULATION_SETTINGS, ...input.settings };
  const ayanamsha = ayanamshaDegrees(input.date, settings.ayanamsha);
  const ascendant = ascendantLongitude(input.date, input.latitude, input.longitude, ayanamsha);
  const ascendantSign = input.fixedAscendantSign ?? Math.floor(ascendant / 30);
  const halfDay = 43_200_000;
  const positions = BODY_MAP.map(({ name, body }) => {
    const tropical = tropicalLongitude(body, input.date);
    const sidereal = normalizeDegrees(tropical - ayanamsha);
    const beforeDate = new Date(input.date.getTime() - halfDay);
    const afterDate = new Date(input.date.getTime() + halfDay);
    const before = normalizeDegrees(tropicalLongitude(body, beforeDate) - ayanamshaDegrees(beforeDate, settings.ayanamsha));
    const after = normalizeDegrees(tropicalLongitude(body, afterDate) - ayanamshaDegrees(afterDate, settings.ayanamsha));
    const speed = name === "Sun" || name === "Moon" ? Math.abs(signedAngularDelta(after, before)) : signedAngularDelta(after, before);
    return positionRecord(name, sidereal, tropical, speed, ascendantSign);
  });
  const rahuTropical = meanNodeTropical(input.date);
  const rahuSidereal = normalizeDegrees(rahuTropical - ayanamsha);
  const nodeSpeed = -0.0529538083 - (ayanamshaDegrees(new Date(input.date.getTime() + 86_400_000), settings.ayanamsha) - ayanamsha);
  positions.push(
    positionRecord("Rahu", rahuSidereal, rahuTropical, nodeSpeed, ascendantSign),
    positionRecord("Ketu", rahuSidereal + 180, normalizeDegrees(rahuTropical + 180), nodeSpeed, ascendantSign),
  );
  const warnings = [{ code: "approximate-ayanamsha", message: AYANAMSHA_METADATA[settings.ayanamsha].note }];
  if (settings.nodeMode === "true") warnings.push({ code: "true-node-fallback", message: "True-node calculation is not available in this engine; mean nodes are returned as an explicit fallback." });
  return {
    date: new Date(input.date), latitude: input.latitude, longitude: input.longitude,
    ayanamshaDegrees: ayanamsha, ascendantLongitude: ascendant, ascendantSign,
    positions, settings, warnings,
  };
}

export interface ZonedDateParts { year: number; month: number; day: number; hour: number; minute: number; second?: number }

/** Convert civil-time fields and an IANA zone into UTC. Ambiguous DST times should be confirmed by the caller. */
export function utcFromZonedParts(parts: ZonedDateParts, timeZone: string): Date {
  const desired = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second ?? 0);
  let candidate = desired;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const formatted = Object.fromEntries(formatter.formatToParts(new Date(candidate)).map((part) => [part.type, part.value]));
    const represented = Date.UTC(Number(formatted.year), Number(formatted.month) - 1, Number(formatted.day), Number(formatted.hour), Number(formatted.minute), Number(formatted.second));
    candidate += desired - represented;
  }
  return new Date(candidate);
}
