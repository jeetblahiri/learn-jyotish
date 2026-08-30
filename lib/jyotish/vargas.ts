import type { VargaId } from "./types";

export function normalizeDegrees(value: number): number { return ((value % 360) + 360) % 360; }

export function vargaSign(longitude: number, varga: VargaId): number {
  const value = normalizeDegrees(longitude);
  const sign = Math.floor(value / 30);
  const degree = value % 30;
  if (varga === "D1") return sign;
  if (varga === "D9") {
    const division = Math.min(8, Math.floor(degree / (30 / 9)));
    const modality = sign % 3; // Aries=movable, Taurus=fixed, Gemini=dual.
    const start = modality === 0 ? sign : modality === 1 ? sign + 8 : sign + 4;
    return (start + division) % 12;
  }
  const division = Math.min(9, Math.floor(degree / 3));
  const start = sign % 2 === 0 ? sign : sign + 8; // odd zodiac signs start from themselves; even from their ninth.
  return (start + division) % 12;
}

export function allSupportedVargas(longitude: number): Record<VargaId, number> {
  return { D1: vargaSign(longitude, "D1"), D9: vargaSign(longitude, "D9"), D10: vargaSign(longitude, "D10") };
}
