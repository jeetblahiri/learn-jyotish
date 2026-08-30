import { NAKSHATRAS, VIMSHOTTARI_SEQUENCE } from "./constants";
import type { NakshatraPosition } from "./types";
import { normalizeDegrees } from "./vargas";

const SPAN = 360 / 27;

export function nakshatraAt(longitude: number): NakshatraPosition {
  const value = normalizeDegrees(longitude);
  const index = Math.min(26, Math.floor(value / SPAN));
  const degreeWithin = value - index * SPAN;
  return {
    index,
    name: NAKSHATRAS[index],
    lord: VIMSHOTTARI_SEQUENCE[index % 9],
    pada: (Math.min(3, Math.floor(degreeWithin / (SPAN / 4))) + 1) as 1 | 2 | 3 | 4,
    degreeWithin,
    fractionElapsed: degreeWithin / SPAN,
  };
}
