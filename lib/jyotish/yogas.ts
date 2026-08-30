import type { ClassicalPlanet, JyotishChart, PlanetName, RuleProvenance } from "./types";
import { aspectsHouse, dignityOf, lordOfHouse, lordOfSign } from "./rules";

const YOGA_PROVENANCE: RuleProvenance = { kind: "traditional-rule", tradition: "Parashari-oriented teaching model", rule: "Candidate yoga structure; strength and cancellation require full-chart review" };

export interface YogaCandidate {
  id: string; name: string; participants: PlanetName[]; status: "candidate" | "modified-candidate";
  evidence: string[]; cautions: string[]; provenance: RuleProvenance;
}

function pos(chart: JyotishChart, planet: PlanetName) { return chart.positions.find((item) => item.name === planet)!; }
function connected(chart: JyotishChart, a: ClassicalPlanet, b: ClassicalPlanet): boolean {
  const first = pos(chart, a); const second = pos(chart, b);
  return first.house === second.house || aspectsHouse(first, second.house) || aspectsHouse(second, first.house);
}

export function detectYogaCandidates(chart: JyotishChart): YogaCandidate[] {
  const candidates: YogaCandidate[] = [];
  const dharmaLords = [1, 5, 9].map((house) => lordOfHouse(chart, house));
  const karmaLords = [4, 7, 10].map((house) => lordOfHouse(chart, house));
  for (const dharma of [...new Set(dharmaLords)]) for (const karma of [...new Set(karmaLords)]) {
    if (dharma !== karma && connected(chart, dharma, karma)) candidates.push({ id: `dharma-karma-${dharma}-${karma}`, name: "Dharma–kendra linkage", participants: [dharma, karma], status: "candidate", evidence: [`${dharma} and ${karma} are joined by co-tenancy or graha aspect.`, "They carry trinal and angular house topics."], cautions: ["House ownership, dignity, conjunction width, divisional charts and timing can substantially modify expression."], provenance: YOGA_PROVENANCE });
  }
  const moon = pos(chart, "Moon"); const jupiter = pos(chart, "Jupiter");
  const moonToJupiter = ((jupiter.sign - moon.sign + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(moonToJupiter)) candidates.push({ id: "gajakesari", name: "Gajakesari candidate", participants: ["Moon", "Jupiter"], status: "candidate", evidence: [`Jupiter is ${moonToJupiter} signs from the Moon, a kendra relationship.`], cautions: ["This common rule should not be read as guaranteed status; dignity, affliction and repetition matter."], provenance: YOGA_PROVENANCE });
  const classical: ClassicalPlanet[] = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  for (let i = 0; i < classical.length; i += 1) for (let j = i + 1; j < classical.length; j += 1) {
    const a = pos(chart, classical[i]); const b = pos(chart, classical[j]);
    if (lordOfHouse(chart, a.house) === b.name && lordOfHouse(chart, b.house) === a.name) candidates.push({ id: `exchange-${a.name}-${b.name}`, name: "Parivartana candidate", participants: [a.name, b.name], status: "candidate", evidence: [`${a.name} and ${b.name} occupy one another's signs.`], cautions: ["Classify the houses exchanged before interpreting the result."], provenance: YOGA_PROVENANCE });
  }
  for (const planet of classical) {
    const position = pos(chart, planet); const dignity = dignityOf(position);
    if (dignity.label === "debilitated") {
      const signLord = pos(chart, lordOfSign(position.sign));
      if ([1, 4, 7, 10].includes(signLord.house)) candidates.push({ id: `neecha-bhanga-${planet}`, name: "Neecha-bhanga condition candidate", participants: [planet, signLord.name], status: "modified-candidate", evidence: [`${planet} is debilitated and its sign lord ${signLord.name} occupies a natal kendra.`], cautions: ["Cancellation rules are numerous and lineage-sensitive; cancellation does not simply convert every result into exaltation."], provenance: YOGA_PROVENANCE });
    }
  }
  for (const house of [6, 8, 12]) {
    const lord = lordOfHouse(chart, house); const lordPosition = pos(chart, lord);
    if ([6, 8, 12].includes(lordPosition.house)) candidates.push({ id: `viparita-${house}-${lord}`, name: "Viparita pattern candidate", participants: [lord], status: "candidate", evidence: [`Lord of H${house}, ${lord}, occupies H${lordPosition.house}, another dusthana.`], cautions: ["Do not infer success from adversity without checking mixed lordship, dignity, associations and timing."], provenance: YOGA_PROVENANCE });
  }
  return candidates.filter((item, index, all) => all.findIndex((other) => other.id === item.id) === index);
}
