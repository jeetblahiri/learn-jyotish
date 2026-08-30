import { VIMSHOTTARI_SEQUENCE, VIMSHOTTARI_YEARS } from "./constants";
import type { JyotishChart, PlanetName } from "./types";

const TROPICAL_YEAR_MS = 365.2425 * 86_400_000;

export interface AntardashaPeriod { lord: PlanetName; start: Date; end: Date }
export interface MahadashaPeriod {
  lord: PlanetName; start: Date; end: Date; displayStart: Date; activeAtBirth: boolean;
  antardashas: AntardashaPeriod[];
}

function addYears(date: Date, years: number): Date { return new Date(date.getTime() + years * TROPICAL_YEAR_MS); }
function sequenceFrom(lord: PlanetName): PlanetName[] {
  const start = VIMSHOTTARI_SEQUENCE.indexOf(lord);
  return [...VIMSHOTTARI_SEQUENCE.slice(start), ...VIMSHOTTARI_SEQUENCE.slice(0, start)];
}

export function antardashasForMahadasha(lord: PlanetName, start: Date): AntardashaPeriod[] {
  const periods: AntardashaPeriod[] = []; let cursor = new Date(start);
  for (const subLord of sequenceFrom(lord)) {
    const durationYears = VIMSHOTTARI_YEARS[lord] * VIMSHOTTARI_YEARS[subLord] / 120;
    const end = addYears(cursor, durationYears);
    periods.push({ lord: subLord, start: cursor, end }); cursor = end;
  }
  return periods;
}

/** Vimshottari teaching timeline derived from the Moon's 27-nakshatra position. */
export function vimshottariTimeline(chart: JyotishChart, yearsForward = 120): MahadashaPeriod[] {
  const moon = chart.positions.find((position) => position.name === "Moon");
  if (!moon) throw new Error("The chart requires a Moon position for Vimshottari timing.");
  const birth = chart.date;
  const birthLord = moon.nakshatra.lord;
  const elapsedYears = VIMSHOTTARI_YEARS[birthLord] * moon.nakshatra.fractionElapsed;
  let cursor = addYears(birth, -elapsedYears);
  const cutoff = addYears(birth, yearsForward);
  const result: MahadashaPeriod[] = [];
  let sequence = sequenceFrom(birthLord);
  while (cursor < cutoff) {
    for (const lord of sequence) {
      const end = addYears(cursor, VIMSHOTTARI_YEARS[lord]);
      if (end > birth && cursor < cutoff) result.push({
        lord, start: cursor, end, displayStart: cursor < birth ? new Date(birth) : cursor,
        activeAtBirth: cursor <= birth && end > birth,
        antardashas: antardashasForMahadasha(lord, cursor).filter((period) => period.end > birth && period.start < cutoff),
      });
      cursor = end;
      if (cursor >= cutoff) break;
    }
    sequence = VIMSHOTTARI_SEQUENCE;
  }
  return result;
}

export function activeDashaAt(timeline: MahadashaPeriod[], date: Date): { maha?: MahadashaPeriod; antar?: AntardashaPeriod } {
  const maha = timeline.find((period) => period.start <= date && period.end > date);
  return { maha, antar: maha?.antardashas.find((period) => period.start <= date && period.end > date) };
}
