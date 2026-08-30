import { HOUSE_TOPICS, SIGNS } from "./constants";
import { aspectsHouse, conjunctions, dignityOf, dispositorChain, functionalRole, housesRuled, lordOfHouse } from "./rules";
import type { ClassicalPlanet, Evidence, JyotishChart, PlanetName, Synthesis } from "./types";

const hypothesis = (rule: string) => ({ kind: "interpretive-hypothesis" as const, tradition: "Transparent teaching synthesis", rule });
const traditional = (rule: string) => ({ kind: "traditional-rule" as const, tradition: "Parashari-oriented whole-sign model", rule });

export interface SynthesisFocus { planet?: PlanetName; house?: number }

export function synthesizeChart(chart: JyotishChart, focus: SynthesisFocus = {}): Synthesis {
  const position = focus.planet ? chart.positions.find((item) => item.name === focus.planet) : undefined;
  const house = focus.house ?? position?.house ?? 1;
  const occupants = chart.positions.filter((item) => item.house === house);
  const houseLord = lordOfHouse(chart, house);
  const lordPosition = chart.positions.find((item) => item.name === houseLord)!;
  const supporting: Evidence[] = [{ id: `house-${house}-lord`, level: "foundational", statement: `H${house} (${HOUSE_TOPICS[house - 1]}) is ${SIGNS[(chart.ascendantSign + house - 1) % 12]} and its lord ${houseLord} carries these topics into H${lordPosition.house}.`, provenance: traditional("House sign, lord and placement") }];
  const modifying: Evidence[] = []; const counter: Evidence[] = [];
  for (const occupant of occupants) {
    supporting.push({ id: `occupant-${occupant.name}`, level: "supporting", statement: `${occupant.name} occupies H${house}; its significations participate in this field.`, provenance: hypothesis("Planetary occupancy as a thematic contribution") });
    const dignity = dignityOf(occupant);
    const evidence = { id: `dignity-${occupant.name}`, level: "modifying" as const, statement: `${occupant.name} is ${dignity.label}; this modifies ease and method rather than deciding the outcome.`, provenance: dignity.provenance };
    if (dignity.label === "debilitated" || dignity.label === "enemy-sign") counter.push({ ...evidence, level: "modifying" }); else modifying.push(evidence);
  }
  for (const incoming of chart.positions.filter((item) => item.house !== house && aspectsHouse(item, house))) modifying.push({ id: `aspect-${incoming.name}-${house}`, level: incoming.name === "Rahu" || incoming.name === "Ketu" ? "tradition-dependent" : "supporting", statement: `${incoming.name} casts a teaching-model graha aspect toward H${house}.`, provenance: traditional(incoming.name === "Rahu" || incoming.name === "Ketu" ? "Lineage-dependent node aspect" : "Graha drishti") });
  if (position) {
    const chain = dispositorChain(chart, position.name);
    modifying.push({ id: `dispositor-${position.name}`, level: "modifying", statement: chain.finalDispositor ? `${position.name}'s dispositor chain resolves to ${chain.finalDispositor}.` : `The dispositor chain for ${position.name} forms or approaches a cycle: ${chain.cycle?.join(" → ") ?? "inspect manually"}.`, provenance: traditional("Sign-dispositor dependency") });
    if (position.vargas.D1 === position.vargas.D9) supporting.push({ id: `vargottama-${position.name}`, level: "supporting", statement: `${position.name} repeats its sign in D1 and D9 (vargottama), reinforcing sign-method continuity in this teaching model.`, provenance: traditional("D1/D9 sign repetition") });
    const close = conjunctions(chart).filter((item) => item.first === position.name || item.second === position.name);
    for (const item of close) modifying.push({ id: `conjunction-${item.first}-${item.second}`, level: item.close ? "strong" : "modifying", statement: `${item.first} and ${item.second} share ${item.sameSign ? "a sign" : "a house"}; their longitudinal separation is ${item.separation.toFixed(1)}°${item.close ? ", within the default close-contact orb" : ""}.`, provenance: traditional("Distinguish sign/house co-tenancy from close longitudinal contact") });
  }
  const repeatedCount = supporting.filter((item) => item.level === "strong" || item.level === "supporting").length;
  const confidence: Synthesis["confidence"] = repeatedCount >= 4 && counter.length === 0 ? "strongly-repeated" : repeatedCount >= 2 ? "moderate" : "low";
  return {
    claim: `A responsible working hypothesis is that ${HOUSE_TOPICS[house - 1]} develops through ${houseLord}'s placement in H${lordPosition.house}${occupants.length ? `, with ${occupants.map((item) => item.name).join(" and ")} directly participating` : ""}.`,
    supporting, modifying, counter, confidence,
    limits: ["This is a symbolic interpretive hypothesis, not an empirical probability or inevitable event.", "Confirm repetition in relevant vargas and Vimshottari periods before making a timing hypothesis.", "Age, life stage, culture, choices and birth-time reliability can materially change expression."],
  };
}

export function chartFunctionalRoles(chart: JyotishChart) {
  const planets: ClassicalPlanet[] = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  return planets.map((planet) => functionalRole(chart, planet)).filter((role) => housesRuled(chart, role.planet).length);
}
