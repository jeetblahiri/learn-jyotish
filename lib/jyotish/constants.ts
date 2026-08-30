import type { ClassicalPlanet, PlanetName } from "./types";

export const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"] as const;

export const HOUSE_TOPICS = [
  "self, body and direction", "resources, speech and values", "effort, courage and skills",
  "home, roots and inner steadiness", "creativity, learning and discernment", "work, health and problem-solving",
  "partnerships and agreements", "change, vulnerability and shared resources", "meaning, teachers and long journeys",
  "responsibility and public contribution", "communities, gains and long-term aims", "release, retreat and what lies beyond view",
] as const;

export const SIGN_LORDS: ClassicalPlanet[] = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
] as const;

export const VIMSHOTTARI_SEQUENCE: PlanetName[] = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
export const VIMSHOTTARI_YEARS: Record<PlanetName, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export const ASPECT_COUNTS: Record<PlanetName, number[]> = {
  Sun: [7], Moon: [7], Mercury: [7], Venus: [7], Mars: [4, 7, 8],
  Jupiter: [5, 7, 9], Saturn: [3, 7, 10], Rahu: [5, 7, 9], Ketu: [5, 7, 9],
};

export const OWN_SIGNS: Record<ClassicalPlanet, number[]> = {
  Sun: [4], Moon: [3], Mercury: [2, 5], Venus: [1, 6], Mars: [0, 7], Jupiter: [8, 11], Saturn: [9, 10],
};

export const EXALTATION_SIGNS: Record<ClassicalPlanet, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
};

export const MOOLATRIKONA: Partial<Record<ClassicalPlanet, { sign: number; from: number; to: number }>> = {
  Sun: { sign: 4, from: 0, to: 20 }, Moon: { sign: 1, from: 4, to: 30 }, Mars: { sign: 0, from: 0, to: 12 },
  Mercury: { sign: 5, from: 16, to: 20 }, Jupiter: { sign: 8, from: 0, to: 10 }, Venus: { sign: 6, from: 0, to: 15 },
  Saturn: { sign: 10, from: 0, to: 20 },
};

export const NATURAL_FRIENDS: Record<ClassicalPlanet, ClassicalPlanet[]> = {
  Sun: ["Moon", "Mars", "Jupiter"], Moon: ["Sun", "Mercury"], Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"], Jupiter: ["Sun", "Moon", "Mars"], Venus: ["Mercury", "Saturn"], Saturn: ["Mercury", "Venus"],
};

export const NATURAL_ENEMIES: Record<ClassicalPlanet, ClassicalPlanet[]> = {
  Sun: ["Venus", "Saturn"], Moon: [], Mars: ["Mercury"], Mercury: ["Moon"], Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"], Saturn: ["Sun", "Moon", "Mars"],
};
