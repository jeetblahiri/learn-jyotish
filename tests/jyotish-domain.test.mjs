import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import test from "node:test";

// Compile the TypeScript domain package in isolation so this test stays useful with Node's native runner.
const output = mkdtempSync(join(tmpdir(), "drishti-jyotish-test-"));
symlinkSync(join(process.cwd(), "node_modules"), join(output, "node_modules"), "dir");
execFileSync(join(process.cwd(), "node_modules", ".bin", "tsc"), [
  "--outDir", output, "--rootDir", process.cwd(), "--target", "es2022", "--module", "commonjs",
  "--moduleResolution", "node", "--esModuleInterop", "--strict", "--skipLibCheck", "lib/jyotish/index.ts",
], { cwd: process.cwd(), stdio: "pipe" });
const require = createRequire(import.meta.url);
const jyotish = require(join(output, "lib", "jyotish", "index.js"));

test("nakshatra and pada boundaries are generative and deterministic", () => {
  assert.deepEqual(jyotish.nakshatraAt(0), {
    index: 0, name: "Ashwini", lord: "Ketu", pada: 1, degreeWithin: 0, fractionElapsed: 0,
  });
  assert.equal(jyotish.nakshatraAt(13 + 20 / 60 + 1e-8).name, "Bharani");
  assert.equal(jyotish.nakshatraAt(10).pada, 4);
  assert.equal(jyotish.nakshatraAt(359.999).name, "Revati");
});

test("D1, D9 and D10 mappings follow movable/fixed/dual and odd/even starts", () => {
  assert.equal(jyotish.vargaSign(1, "D9"), 0);       // Aries first navamsa -> Aries
  assert.equal(jyotish.vargaSign(31, "D9"), 9);      // Taurus first navamsa -> Capricorn
  assert.equal(jyotish.vargaSign(61, "D9"), 6);      // Gemini first navamsa -> Libra
  assert.equal(jyotish.vargaSign(1, "D10"), 0);      // Aries first dasamsa -> Aries
  assert.equal(jyotish.vargaSign(31, "D10"), 9);     // Taurus first dasamsa -> Capricorn
});

test("chart calculation returns complete sidereal records and explicit fallbacks", () => {
  const chart = jyotish.calculateChart({
    date: new Date("1992-07-14T05:02:00.000Z"), latitude: 22.5726, longitude: 88.3639,
    settings: { nodeMode: "true" },
  });
  assert.equal(chart.positions.length, 9);
  assert.ok(chart.ascendantSign >= 0 && chart.ascendantSign < 12);
  assert.ok(chart.positions.every((planet) => planet.house >= 1 && planet.house <= 12));
  assert.ok(chart.positions.every((planet) => planet.nakshatra.pada >= 1 && planet.nakshatra.pada <= 4));
  const rahu = chart.positions.find((planet) => planet.name === "Rahu");
  const ketu = chart.positions.find((planet) => planet.name === "Ketu");
  assert.ok(Math.abs(Math.abs(jyotish.signedAngularDelta(rahu.longitude, ketu.longitude)) - 180) < 1e-9);
  assert.ok(chart.warnings.some((warning) => warning.code === "true-node-fallback"));
});

test("lordship, aspects, conjunction separation and dispositors are inspectable", () => {
  const chart = jyotish.calculateChart({ date: new Date("2000-01-01T12:00:00Z"), latitude: 0, longitude: 0 });
  assert.equal(jyotish.lordOfSign(0), "Mars");
  assert.equal(jyotish.housesRuled(chart, "Mercury").length, 2);
  const mars = chart.positions.find((planet) => planet.name === "Mars");
  assert.deepEqual(jyotish.aspectsFrom(mars, chart).map((aspect) => aspect.count), [4, 7, 8]);
  assert.ok(jyotish.conjunctions(chart).every((pair) => pair.separation >= 0 && pair.separation <= 180));
  assert.ok(jyotish.dispositorChain(chart, "Moon").steps.length > 0);
});

test("Vimshottari timeline begins with the Moon's nakshatra lord and nests antardashas", () => {
  const chart = jyotish.calculateChart({ date: new Date("1992-07-14T05:02:00Z"), latitude: 22.5726, longitude: 88.3639 });
  const moon = chart.positions.find((planet) => planet.name === "Moon");
  const timeline = jyotish.vimshottariTimeline(chart, 40);
  assert.equal(timeline[0].lord, moon.nakshatra.lord);
  assert.equal(timeline[0].activeAtBirth, true);
  assert.ok(timeline[0].antardashas.length > 0);
  assert.equal(jyotish.activeDashaAt(timeline, chart.date).maha?.lord, moon.nakshatra.lord);
});

test("synthesis distinguishes evidence, interpretation and limits", () => {
  const natal = jyotish.calculateChart({ date: new Date("1992-07-14T05:02:00Z"), latitude: 22.5726, longitude: 88.3639 });
  const transit = jyotish.calculateChart({ date: new Date("2026-08-30T12:00:00Z"), latitude: 22.5726, longitude: 88.3639, fixedAscendantSign: natal.ascendantSign });
  const synthesis = jyotish.synthesizeChart(natal, { planet: "Saturn" });
  assert.ok(synthesis.supporting.length > 0);
  assert.ok(synthesis.supporting.every((evidence) => evidence.provenance.kind));
  assert.ok(synthesis.limits.some((limit) => limit.includes("not an empirical probability")));
  assert.ok(jyotish.transitContacts(natal, transit).some((contact) => contact.kind === "house-occupancy"));
  assert.ok(jyotish.detectYogaCandidates(natal).every((candidate) => candidate.cautions.length));
});
