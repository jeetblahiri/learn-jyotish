import { ASPECT_COUNTS, EXALTATION_SIGNS, MOOLATRIKONA, NATURAL_ENEMIES, NATURAL_FRIENDS, OWN_SIGNS, SIGN_LORDS, SIGNS } from "./constants";
import type { ClassicalPlanet, JyotishChart, PlanetName, PlanetPosition, RuleProvenance } from "./types";
import { signedAngularDelta } from "./astronomy";

export const PARASHARI_PROVENANCE: RuleProvenance = {
  kind: "traditional-rule", tradition: "Parashari teaching model", rule: "Whole-sign lordship and graha-drishti rules",
  note: "Node aspect and dignity rules vary by lineage and are labelled separately.",
};

export function lordOfSign(sign: number): ClassicalPlanet { return SIGN_LORDS[((sign % 12) + 12) % 12]; }
export function signForHouse(ascendantSign: number, house: number): number { return (ascendantSign + house - 1) % 12; }
export function lordOfHouse(chart: JyotishChart, house: number): ClassicalPlanet { return lordOfSign(signForHouse(chart.ascendantSign, house)); }
export function housesRuled(chart: JyotishChart, planet: ClassicalPlanet): number[] {
  return Array.from({ length: 12 }, (_, index) => index + 1).filter((house) => lordOfHouse(chart, house) === planet);
}

export interface DignityResult {
  label: "exalted" | "debilitated" | "moolatrikona" | "own-sign" | "friend-sign" | "enemy-sign" | "neutral-sign" | "tradition-dependent";
  signLord?: ClassicalPlanet;
  explanation: string;
  provenance: RuleProvenance;
}

export function dignityOf(position: PlanetPosition): DignityResult {
  if (position.name === "Rahu" || position.name === "Ketu") return {
    label: "tradition-dependent", explanation: "Node dignity schemes differ. Judge the node through its dispositor, house and contacts before adopting a lineage-specific exaltation rule.",
    provenance: { ...PARASHARI_PROVENANCE, rule: "Node dignity deliberately left unresolved" },
  };
  const planet = position.name;
  const signLord = lordOfSign(position.sign);
  const moola = MOOLATRIKONA[planet];
  if (moola && moola.sign === position.sign && position.degree >= moola.from && position.degree < moola.to) return { label: "moolatrikona", signLord, explanation: `${planet} occupies its teaching-model moolatrikona degree range. Exact ranges vary in some teaching lineages.`, provenance: PARASHARI_PROVENANCE };
  if (EXALTATION_SIGNS[planet] === position.sign) return { label: "exalted", signLord, explanation: `${planet} is in its traditional exaltation sign; this describes access to its function, not a guaranteed favourable outcome.`, provenance: PARASHARI_PROVENANCE };
  if ((EXALTATION_SIGNS[planet] + 6) % 12 === position.sign) return { label: "debilitated", signLord, explanation: `${planet} is in its traditional debilitation sign; adaptation, support and cancellation conditions must be examined.`, provenance: PARASHARI_PROVENANCE };
  if (OWN_SIGNS[planet].includes(position.sign)) return { label: "own-sign", signLord, explanation: `${planet} is in a sign it rules and can use familiar methods.`, provenance: PARASHARI_PROVENANCE };
  if (NATURAL_FRIENDS[planet].includes(signLord)) return { label: "friend-sign", signLord, explanation: `${planet} is in the sign of its natural friend ${signLord}. Temporary relationships are not included in this basic layer.`, provenance: PARASHARI_PROVENANCE };
  if (NATURAL_ENEMIES[planet].includes(signLord)) return { label: "enemy-sign", signLord, explanation: `${planet} is in the sign of its natural enemy ${signLord}. This modifies ease of expression rather than deciding the result alone.`, provenance: PARASHARI_PROVENANCE };
  return { label: "neutral-sign", signLord, explanation: `${planet} has a neutral natural relationship with sign lord ${signLord}; inspect dispositor condition and chart context.`, provenance: PARASHARI_PROVENANCE };
}

export interface AspectHit { source: PlanetName; count: number; targetHouse: number; targetPlanets: PlanetName[]; traditionDependent: boolean }

export function aspectsFrom(position: PlanetPosition, chart: JyotishChart): AspectHit[] {
  return ASPECT_COUNTS[position.name].map((count) => {
    const targetHouse = ((position.house + count - 2) % 12) + 1;
    return { source: position.name, count, targetHouse, targetPlanets: chart.positions.filter((item) => item.house === targetHouse).map((item) => item.name), traditionDependent: position.name === "Rahu" || position.name === "Ketu" };
  });
}

export function aspectsHouse(position: PlanetPosition, house: number): boolean {
  return ASPECT_COUNTS[position.name].some((count) => ((position.house + count - 2) % 12) + 1 === house);
}

export interface Conjunction { first: PlanetName; second: PlanetName; separation: number; sameHouse: boolean; sameSign: boolean; close: boolean }

export function conjunctions(chart: JyotishChart, closeOrb = 8): Conjunction[] {
  const result: Conjunction[] = [];
  for (let first = 0; first < chart.positions.length; first += 1) for (let second = first + 1; second < chart.positions.length; second += 1) {
    const a = chart.positions[first]; const b = chart.positions[second];
    const separation = Math.abs(signedAngularDelta(a.longitude, b.longitude));
    if (a.house === b.house || separation <= closeOrb) result.push({ first: a.name, second: b.name, separation, sameHouse: a.house === b.house, sameSign: a.sign === b.sign, close: separation <= closeOrb });
  }
  return result;
}

export interface DispositorStep { planet: PlanetName; sign: number; dispositor: ClassicalPlanet; dispositorHouse: number }
export interface DispositorChain { start: PlanetName; steps: DispositorStep[]; finalDispositor?: ClassicalPlanet; cycle?: PlanetName[] }

export function dispositorChain(chart: JyotishChart, start: PlanetName, maxSteps = 12): DispositorChain {
  const steps: DispositorStep[] = []; const route: PlanetName[] = [start]; let current = start;
  for (let index = 0; index < maxSteps; index += 1) {
    const position = chart.positions.find((item) => item.name === current);
    if (!position) break;
    const dispositor = lordOfSign(position.sign);
    const dispositorPosition = chart.positions.find((item) => item.name === dispositor);
    if (!dispositorPosition) break;
    steps.push({ planet: current, sign: position.sign, dispositor, dispositorHouse: dispositorPosition.house });
    if (dispositor === current) return { start, steps, finalDispositor: dispositor };
    const cycleIndex = route.indexOf(dispositor);
    if (cycleIndex >= 0) return { start, steps, cycle: [...route.slice(cycleIndex), dispositor] };
    route.push(dispositor); current = dispositor;
  }
  return { start, steps };
}

export interface FunctionalRole {
  planet: ClassicalPlanet; ruledHouses: number[]; labels: Array<"trinal-lord" | "angular-lord" | "dusthana-lord" | "maraka-lord" | "yogakaraka-candidate" | "mixed">;
  explanation: string;
}

export function functionalRole(chart: JyotishChart, planet: ClassicalPlanet): FunctionalRole {
  const ruledHouses = housesRuled(chart, planet);
  const labels: FunctionalRole["labels"] = [];
  const trinal = ruledHouses.some((house) => [1, 5, 9].includes(house));
  const angular = ruledHouses.some((house) => [1, 4, 7, 10].includes(house));
  if (trinal) labels.push("trinal-lord");
  if (angular) labels.push("angular-lord");
  if (ruledHouses.some((house) => [6, 8, 12].includes(house))) labels.push("dusthana-lord");
  if (ruledHouses.some((house) => [2, 7].includes(house))) labels.push("maraka-lord");
  if (ruledHouses.some((house) => [4, 7, 10].includes(house)) && ruledHouses.some((house) => [5, 9].includes(house))) labels.push("yogakaraka-candidate");
  if (labels.length > 1 && !labels.includes("yogakaraka-candidate")) labels.push("mixed");
  return { planet, ruledHouses, labels, explanation: `${planet} rules ${ruledHouses.map((house) => `H${house}`).join(" and ")} for ${SIGNS[chart.ascendantSign]} rising. These are functional teaching labels, not a moral good/bad verdict.` };
}
