export type PlanetName =
  | "Sun" | "Moon" | "Mercury" | "Venus" | "Mars"
  | "Jupiter" | "Saturn" | "Rahu" | "Ketu";

export type ClassicalPlanet = Exclude<PlanetName, "Rahu" | "Ketu">;
export type SignIndex = number;
export type HouseNumber = number;
export type AyanamshaId = "lahiri" | "raman-approx" | "kp-approx";
export type NodeMode = "mean" | "true";
export type VargaId = "D1" | "D9" | "D10";
export type ProvenanceKind = "astronomical" | "traditional-rule" | "interpretive-hypothesis";

export interface CalculationSettings {
  ayanamsha: AyanamshaId;
  nodeMode: NodeMode;
  houseSystem: "whole-sign";
  zodiac: "sidereal";
}

export interface CalculationWarning {
  code: string;
  message: string;
}

export interface NakshatraPosition {
  index: number;
  name: string;
  lord: PlanetName;
  pada: 1 | 2 | 3 | 4;
  degreeWithin: number;
  fractionElapsed: number;
}

export interface PlanetPosition {
  name: PlanetName;
  longitude: number;
  tropicalLongitude?: number;
  sign: SignIndex;
  degree: number;
  house: HouseNumber;
  speed: number;
  retrograde: boolean;
  nakshatra: NakshatraPosition;
  vargas: Record<VargaId, SignIndex>;
}

export interface JyotishChart {
  date: Date;
  latitude: number;
  longitude: number;
  ayanamshaDegrees: number;
  ascendantLongitude: number;
  ascendantSign: SignIndex;
  positions: PlanetPosition[];
  settings: CalculationSettings;
  warnings: CalculationWarning[];
}

export interface RuleProvenance {
  kind: ProvenanceKind;
  tradition: string;
  rule: string;
  note?: string;
}

export interface Evidence {
  id: string;
  level: "foundational" | "strong" | "supporting" | "modifying" | "tradition-dependent";
  statement: string;
  provenance: RuleProvenance;
}

export interface Synthesis {
  claim: string;
  supporting: Evidence[];
  modifying: Evidence[];
  counter: Evidence[];
  confidence: "low" | "moderate" | "strongly-repeated";
  limits: string[];
}
