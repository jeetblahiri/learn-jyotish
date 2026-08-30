import type { KnowledgeType, RuleDefinition } from "./types";

export const knowledgeTaxonomy: Record<KnowledgeType, { label: string; question: string; uiTone: string; example: string }> = {
  "astronomical-fact": { label: "Calculated fact", question: "What position or motion was computed?", uiTone: "neutral", example: "Jupiter is at 18°12′ sidereal Gemini." },
  "traditional-rule": { label: "Traditional rule", question: "Which named method maps the chart structure?", uiTone: "gold", example: "Jupiter casts full aspects to the fifth, seventh and ninth houses from itself in this Parashari setting." },
  "interpretive-hypothesis": { label: "Interpretive hypothesis", question: "What plausible lived expression follows from the selected rules and context?", uiTone: "violet", example: "Learning and advisory roles may become more visible during this activation." }
};

export const ruleDefinitions: RuleDefinition[] = [
  { id: "sidereal-position", title: "Sidereal position", knowledgeType: "astronomical-fact", tradition: "astronomical", statement: "A tropical coordinate is converted using the selected ayanamsha.", limits: "Different ayanamshas can move boundary placements; always display the setting.", evidenceWeight: "foundational" },
  { id: "whole-sign-house", title: "Whole-sign house assignment", knowledgeType: "traditional-rule", tradition: "parashari", statement: "The ascendant sign is House 1 and each following sign is the next house.", limits: "Bhava-cusp methods are separate settings and must not be silently mixed.", evidenceWeight: "foundational" },
  { id: "house-lord-link", title: "House lord linkage", knowledgeType: "traditional-rule", tradition: "parashari", statement: "A house lord links its owned field to the house it occupies.", limits: "Condition, multiple ownership, association and context modify the link.", evidenceWeight: "foundational" },
  { id: "functional-role", title: "Functional planetary role", knowledgeType: "traditional-rule", tradition: "parashari", statement: "A graha’s agenda depends partly on the houses it rules for the ascendant.", limits: "Natural and functional classifications answer different questions; lineage details vary.", evidenceWeight: "strong" },
  { id: "graha-aspect", title: "Full graha aspects", knowledgeType: "traditional-rule", tradition: "parashari", statement: "All planets aspect the seventh; Mars adds fourth/eighth, Jupiter fifth/ninth, Saturn third/tenth.", limits: "Node aspects and partial aspect strength are tradition-dependent.", evidenceWeight: "strong" },
  { id: "dispositor-dependency", title: "Dispositor dependency", knowledgeType: "traditional-rule", tradition: "classical-common", statement: "A planet’s sign expression depends on the sign lord’s condition and location.", limits: "A final dispositor does not erase direct placement or other relationships.", evidenceWeight: "strong" },
  { id: "repetition-confidence", title: "Repetition raises interpretive confidence", knowledgeType: "interpretive-hypothesis", tradition: "modern-pedagogy", statement: "A theme repeated by independent chart structures is more credible than one generic keyword.", limits: "Repetition is qualitative and should not be converted to fake probabilities.", evidenceWeight: "foundational" },
  { id: "natal-before-transit", title: "Natal structure before transit", knowledgeType: "interpretive-hypothesis", tradition: "modern-pedagogy", statement: "Transit interpretation should identify the natal structure being activated before proposing outcomes.", limits: "Neither natal nor transit symbolism guarantees a specific external event.", evidenceWeight: "foundational" },
  { id: "dasha-permission", title: "Dasha as active agency", knowledgeType: "interpretive-hypothesis", tradition: "parashari", statement: "Planetary periods foreground the natal agendas of their period lords.", limits: "The metaphor of ‘permission’ is pedagogical; outcome still depends on condition, subperiod, transit and context.", evidenceWeight: "strong" },
  { id: "yoga-candidate", title: "Yoga detection", knowledgeType: "traditional-rule", tradition: "parashari", statement: "A yoga is first detected as a structural candidate, then evaluated for strength, modification and timing.", limits: "Do not print the textbook result as an inevitable life event.", evidenceWeight: "supporting" },
  { id: "node-settings", title: "Node rule settings", knowledgeType: "traditional-rule", tradition: "tradition-dependent", statement: "Node aspects, rulerships and dignities must be enabled by an explicit tradition setting.", limits: "There is no single uncontested node convention across Jyotish practice.", evidenceWeight: "modifying" },
  { id: "contextual-expression", title: "Contextual expression", knowledgeType: "interpretive-hypothesis", tradition: "modern-pedagogy", statement: "Age, culture, resources and known life context determine which symbolic expression is plausible.", limits: "Context improves relevance but does not validate astrology scientifically.", evidenceWeight: "foundational" }
];

export const evidenceWeights = [
  { id: "foundational", label: "Foundational", meaning: "Required structural basis for the claim." },
  { id: "strong", label: "Strong reinforcement", meaning: "Independent repetition or a highly relevant condition." },
  { id: "supporting", label: "Supporting", meaning: "Adds plausibility without carrying the claim alone." },
  { id: "modifying", label: "Modifying", meaning: "Changes tone, ease, scope or likely expression." },
  { id: "speculative", label: "Weak/speculative", meaning: "Tradition-dependent, generic or insufficient without corroboration." }
] as const;
