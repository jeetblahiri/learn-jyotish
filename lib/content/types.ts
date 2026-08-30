export type Tradition =
  | "astronomical"
  | "parashari"
  | "jaimini"
  | "classical-common"
  | "modern-pedagogy"
  | "tradition-dependent";

export type KnowledgeType =
  | "astronomical-fact"
  | "traditional-rule"
  | "interpretive-hypothesis";

export type Level = "foundation" | "intermediate" | "advanced";

export interface SourceNote {
  tradition: Tradition;
  knowledgeType: KnowledgeType;
  note?: string;
}

export interface FoundationModule {
  id: string;
  order: number;
  title: string;
  objective: string;
  explanation: string;
  principles: string[];
  interactivePrompt: string;
  workedExample: { setup: string; reasoning: string[]; synthesis: string };
  commonMistake: string;
  masteryQuestion: { prompt: string; choices: string[]; answer: number; feedback: string };
  summary: string;
  source: SourceNote;
}

export interface GrahaProfile {
  id: string;
  name: string;
  sanskrit: string;
  glyph: string;
  role: string;
  naturalClass: "benefic" | "malefic" | "conditional";
  significations: string[];
  constructive: string[];
  strained: string[];
  developmentalQuestion: string;
  owns: string[];
  exalted: string;
  debilitated: string;
  teachingHook: string;
  source: SourceNote;
}

export interface HouseProfile {
  number: number;
  sanskrit: string;
  title: string;
  core: string;
  concrete: string[];
  inner: string[];
  people: string[];
  classifications: string[];
  developmentalQuestion: string;
  links: number[];
  source: SourceNote;
}

export interface SignProfile {
  id: string;
  number: number;
  name: string;
  sanskrit: string;
  ruler: string;
  element: "fire" | "earth" | "air" | "water";
  modality: "movable" | "fixed" | "dual";
  polarity: "active" | "receptive";
  guna: "sattva" | "rajas" | "tamas";
  style: string;
  constructive: string[];
  distorted: string[];
  teachingHook: string;
  source: SourceNote;
}

export interface NakshatraProfile {
  number: number;
  id: string;
  name: string;
  span: string;
  lord: string;
  deity: string;
  symbol: string;
  shakti: string;
  motivation: "dharma" | "artha" | "kama" | "moksha";
  teachingHook: string;
  padas: Array<{ pada: 1 | 2 | 3 | 4; navamsha: string; hook: string }>;
  source: SourceNote;
}

export interface GlossaryEntry {
  term: string;
  devanagari?: string;
  transliteration: string;
  plainEnglish: string;
  category: string;
  related: string[];
}

export interface RuleDefinition {
  id: string;
  title: string;
  knowledgeType: KnowledgeType;
  tradition: Tradition;
  statement: string;
  limits: string;
  evidenceWeight: "foundational" | "strong" | "supporting" | "modifying" | "speculative";
}

export interface PracticeQuestion {
  id: string;
  level: Level;
  moduleId: string;
  format: "multiple-choice" | "rank-evidence" | "short-reasoning" | "spot-overclaim";
  prompt: string;
  choices?: string[];
  answer: string | number | number[];
  rubric: string[];
  explanation: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  level: Level;
  context: string;
  birthTimeConfidence: "high" | "medium" | "low";
  placements: string[];
  tensions: string[];
  prompts: string[];
  evidence: Array<{ direction: "supports" | "modifies" | "contradicts"; statement: string }>;
  modelSynthesis: string;
  timingCaution: string;
}

export interface CurriculumPath {
  id: string;
  title: string;
  level: Level;
  promise: string;
  prerequisites: string[];
  units: Array<{ id: string; title: string; outcome: string; activities: string[] }>;
  completionEvidence: string;
}
