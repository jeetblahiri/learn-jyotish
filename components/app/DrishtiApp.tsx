"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  AYANAMSHA_METADATA,
  DEFAULT_CALCULATION_SETTINGS,
  HOUSE_TOPICS,
  SIGNS,
  activeDashaAt,
  aspectsFrom,
  calculateChart,
  chartFunctionalRoles,
  detectYogaCandidates,
  dignityOf,
  dispositorChain,
  functionalRole,
  synthesizeChart,
  transitContacts,
  utcFromZonedParts,
  vargaSign,
  vimshottariTimeline,
  type AyanamshaId,
  type CalculationSettings,
  type PlanetName,
  type VargaId,
} from "@/lib/jyotish";
import {
  caseStudies,
  curriculumPaths,
  foundationModules,
  glossary,
  grahaProfiles,
  houseProfiles,
  knowledgeTaxonomy,
  nakshatraProfiles,
  practiceQuestions,
  signProfiles,
} from "@/lib/content";
import { EvidenceTrail, NorthIndianChart, SkySphere, type ChartAspect, type ChartPlanet, type EvidenceItem } from "@/components/jyotish";
import { findPlace, places, type Place } from "@/lib/places";
import { emptyWorkspace, exportWorkspace, readWorkspace, writeWorkspace, type StoredChart, type WorkspaceSnapshot } from "@/lib/workspace-storage";
import { WorkspaceNav, type WorkspaceSection } from "./WorkspaceNav";
import { PlaceSearch } from "./PlaceSearch";
import { NotebookPanel } from "./NotebookPanel";
import styles from "./DrishtiApp.module.css";

const planetShort: Record<PlanetName, string> = { Sun: "Su", Moon: "Mo", Mercury: "Me", Venus: "Ve", Mars: "Ma", Jupiter: "Ju", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" };
const planetColor: Record<PlanetName, string> = { Sun: "#eba83c", Moon: "#b8d9e6", Mercury: "#7dbb9c", Venus: "#e09bb1", Mars: "#dc6855", Jupiter: "#d9b451", Saturn: "#8795aa", Rahu: "#9e84ca", Ketu: "#c7825f" };
const initialPlace = findPlace("kolkata") ?? places[0];
const initialSettings: CalculationSettings = DEFAULT_CALCULATION_SETTINGS;
const initialTransitDate = "2026-08-30";

type BirthDraft = {
  name: string;
  date: string;
  time: string;
  reliability: StoredChart["reliability"];
  place: Place;
};

const defaultBirth: BirthDraft = { name: "Arun", date: "1992-07-14", time: "10:32", reliability: "exact", place: initialPlace };

function utcForBirth(birth: BirthDraft) {
  const [year, month, day] = birth.date.split("-").map(Number);
  const [hour, minute] = birth.time.split(":").map(Number);
  return utcFromZonedParts({ year, month, day, hour, minute }, birth.place.timeZone);
}

function degree(value: number) {
  const d = Math.floor(value);
  const minutes = Math.floor((value - d) * 60);
  const seconds = Math.floor((((value - d) * 60) - minutes) * 60);
  return `${d}° ${String(minutes).padStart(2, "0")}′ ${String(seconds).padStart(2, "0")}″`;
}

function dateInput(date: Date) { return date.toISOString().slice(0, 10); }
function addMonths(base: string, months: number) { const value = new Date(`${base}T12:00:00Z`); value.setUTCMonth(value.getUTCMonth() + months); return dateInput(value); }
function profileForPlanet(name: PlanetName) { return grahaProfiles.find((profile) => profile.name === name)!; }

export default function DrishtiApp() {
  const [section, setSection] = useState<WorkspaceSection>("learn");
  const [birthDraft, setBirthDraft] = useState<BirthDraft>(defaultBirth);
  const [birth, setBirth] = useState<BirthDraft>(defaultBirth);
  const [settings, setSettings] = useState<CalculationSettings>(initialSettings);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetName>("Saturn");
  const [selectedHouse, setSelectedHouse] = useState(5);
  const [chartView, setChartView] = useState<VargaId | "chandra">("D1");
  const [showTransit, setShowTransit] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lessonAnswer, setLessonAnswer] = useState<number | null>(null);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [caseId, setCaseId] = useState(caseStudies[0]?.id ?? "");
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [transitDateText, setTransitDateText] = useState(initialTransitDate);
  const [transitTime, setTransitTime] = useState("12:00");
  const [timeScale, setTimeScale] = useState<"day" | "week" | "month" | "year" | "30year">("month");
  const [transitMonths, setTransitMonths] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceSnapshot>(emptyWorkspace);
  const [hydrated, setHydrated] = useState(false);
  const [context, setContext] = useState({ lifeStage: "Adult", work: "", relationships: "", knownEvents: "" });

  useEffect(() => {
    queueMicrotask(() => { setWorkspace(readWorkspace()); setHydrated(true); });
  }, []);
  useEffect(() => { if (hydrated) writeWorkspace(workspace); }, [workspace, hydrated]);
  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => {
      setTransitMonths((current) => {
        const step = timeScale === "day" ? 0 : timeScale === "week" ? 0 : timeScale === "month" ? 1 : timeScale === "year" ? 12 : 6;
        if (step === 0) {
          setTransitDateText((date) => { const next = new Date(`${date}T12:00:00Z`); next.setUTCDate(next.getUTCDate() + (timeScale === "day" ? 1 : 7)); return dateInput(next); });
          return current;
        }
        return Math.min(360, current + step);
      });
    }, 900);
    return () => window.clearInterval(interval);
  }, [playing, timeScale]);

  const birthUtc = useMemo(() => utcForBirth(birth), [birth]);
  const natal = useMemo(() => calculateChart({ date: birthUtc, latitude: birth.place.latitude, longitude: birth.place.longitude, settings }), [birthUtc, birth.place.latitude, birth.place.longitude, settings]);
  const effectiveTransitDate = timeScale === "30year" || timeScale === "year" ? addMonths(transitDateText, transitMonths) : transitDateText;
  const transitUtc = useMemo(() => {
    const [year, month, day] = effectiveTransitDate.split("-").map(Number); const [hour, minute] = transitTime.split(":").map(Number);
    return new Date(Date.UTC(year, month - 1, day, hour, minute));
  }, [effectiveTransitDate, transitTime]);
  const transit = useMemo(() => calculateChart({ date: transitUtc, latitude: birth.place.latitude, longitude: birth.place.longitude, settings, fixedAscendantSign: natal.ascendantSign }), [transitUtc, birth.place.latitude, birth.place.longitude, settings, natal.ascendantSign]);
  const selected = natal.positions.find((planet) => planet.name === selectedPlanet) ?? natal.positions[0];
  const selectedProfile = profileForPlanet(selected.name);
  const selectedHouseProfile = houseProfiles[selectedHouse - 1];
  const selectedNakshatraProfile = nakshatraProfiles[selected.nakshatra.index];
  const selectedDignity = dignityOf(selected);
  const selectedAspects = aspectsFrom(selected, natal);
  const selectedDispositor = dispositorChain(natal, selected.name);
  const selectedFunctional = selected.name === "Rahu" || selected.name === "Ketu" ? null : functionalRole(natal, selected.name);
  const synthesis = synthesizeChart(natal, { planet: selectedPlanet, house: selectedHouse });
  const yogaCandidates = detectYogaCandidates(natal);
  const roles = chartFunctionalRoles(natal);
  const dashas = useMemo(() => vimshottariTimeline(natal), [natal]);
  const activeDasha = useMemo(() => activeDashaAt(dashas, transitUtc), [dashas, transitUtc]);
  const contacts = useMemo(() => transitContacts(natal, transit, 3).filter((contact) => contact.kind !== "house-occupancy" || contact.transitPlanet === selectedPlanet), [natal, transit, selectedPlanet]);
  const selectedTransit = transit.positions.find((planet) => planet.name === selectedPlanet)!;
  const lesson = foundationModules[lessonIndex];
  const practice = practiceQuestions[practiceIndex];
  const activeCase = caseStudies.find((item) => item.id === caseId) ?? caseStudies[0];

  const displayAscSign = useMemo(() => {
    if (chartView === "chandra") return natal.positions.find((planet) => planet.name === "Moon")!.sign;
    if (chartView === "D1") return natal.ascendantSign;
    return vargaSign(natal.ascendantLongitude, chartView);
  }, [chartView, natal]);
  const displayPlanets: ChartPlanet[] = useMemo(() => {
    const natalLayer = natal.positions.map((planet) => {
      const sign = chartView === "D1" || chartView === "chandra" ? planet.sign : planet.vargas[chartView];
      return { id: `natal-${planet.name}`, name: planet.name, shortLabel: planetShort[planet.name], sign, house: ((sign - displayAscSign + 12) % 12) + 1, longitude: planet.longitude, degree: planet.degree, retrograde: planet.retrograde, layer: "natal" as const };
    });
    if (!showTransit || chartView !== "D1") return natalLayer;
    return [...natalLayer, ...transit.positions.map((planet) => ({ id: `transit-${planet.name}`, name: planet.name, shortLabel: planetShort[planet.name], sign: planet.sign, house: planet.house, longitude: planet.longitude, degree: planet.degree, retrograde: planet.retrograde, layer: "transit" as const }))];
  }, [natal, transit, chartView, displayAscSign, showTransit]);
  const chartAspects: ChartAspect[] = selectedAspects.map((aspect) => ({ id: `${selected.name}-${aspect.count}`, fromHouse: selected.house, toHouse: aspect.targetHouse, label: `${selected.name} ${aspect.count}th aspect` }));
  const evidenceItems: EvidenceItem[] = [
    ...synthesis.supporting.map((item) => ({ id: item.id, kind: "supporting" as const, statement: item.statement, strength: item.level === "modifying" ? "supporting" as const : item.level, rule: item.provenance.rule, source: item.provenance.tradition })),
    ...synthesis.modifying.map((item) => ({ id: item.id, kind: "modifying" as const, statement: item.statement, strength: item.level === "modifying" ? "supporting" as const : item.level, rule: item.provenance.rule, source: item.provenance.tradition })),
    ...synthesis.counter.map((item) => ({ id: item.id, kind: "counter" as const, statement: item.statement, strength: item.level === "modifying" ? "weak" as const : item.level, rule: item.provenance.rule, source: item.provenance.tradition })),
  ];
  const filteredGlossary = glossary.filter((entry) => `${entry.term} ${entry.transliteration} ${entry.plainEnglish} ${entry.category}`.toLowerCase().includes(glossaryQuery.toLowerCase()));

  function generate(event: FormEvent) { event.preventDefault(); setBirth(birthDraft); setSelectedPlanet("Saturn"); setSelectedHouse(5); setChartView("D1"); setSection("chart"); }
  function choosePlanet(name: string) { setSelectedPlanet(name as PlanetName); const planet = natal.positions.find((item) => item.name === name); if (planet) setSelectedHouse(planet.house); }
  function saveChart() {
    const stored: StoredChart = { id: `chart-${Date.now()}`, name: birth.name || "Untitled chart", date: birth.date, time: birth.time, placeId: birth.place.id, placeLabel: `${birth.place.label}, ${birth.place.country}`, latitude: birth.place.latitude, longitude: birth.place.longitude, timeZone: birth.place.timeZone, reliability: birth.reliability, createdAt: new Date().toISOString() };
    setWorkspace((current) => ({ ...current, charts: [stored, ...current.charts.filter((chart) => !(chart.name === stored.name && chart.date === stored.date && chart.time === stored.time))] }));
  }
  function completeLesson(score = 1) { setWorkspace((current) => ({ ...current, progress: { ...current.progress, [lesson.id]: { completed: true, score } } })); }
  function downloadWorkspace() {
    const blob = new Blob([exportWorkspace(workspace)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "drishti-workspace.json"; anchor.click(); URL.revokeObjectURL(url);
  }
  function loadStoredChart(chart: StoredChart) {
    const knownPlace = findPlace(chart.placeId);
    const place: Place = knownPlace ?? { id: chart.placeId || "custom", label: chart.placeLabel, country: "", latitude: chart.latitude, longitude: chart.longitude, timeZone: chart.timeZone };
    const restored: BirthDraft = { name: chart.name, date: chart.date, time: chart.time, reliability: chart.reliability, place };
    setBirthDraft(restored); setBirth(restored); setChartView("D1"); setSection("chart");
  }
  async function importWorkspaceFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<WorkspaceSnapshot> & { format?: string };
      if (parsed.format !== "drishti-workspace" || !Array.isArray(parsed.charts) || !Array.isArray(parsed.notebook)) throw new Error("Unsupported workspace file");
      setWorkspace({ charts: parsed.charts, notebook: parsed.notebook, progress: parsed.progress ?? {}, settings: { ...emptyWorkspace.settings, ...(parsed.settings ?? {}) } });
    } catch {
      window.alert("This is not a valid Drishti workspace export.");
    } finally {
      event.target.value = "";
    }
  }

  const workspaceTitles: Record<WorkspaceSection, [string, string]> = {
    learn: ["Learn the generative grammar", "A twelve-module path from calculated sky to responsible synthesis."], chart: ["Explore the chart", "Select any house, sign or graha and inspect the rule chain."], synthesis: ["Compile evidence, not verdicts", "Supporting, modifying and counter-evidence remain visible together."], timing: ["Layer daśā and transit time", "Move from natal promise to active period, slow chapter and shorter trigger."], sky: ["Connect chart symbols to the sky", "Rotate a longitude-faithful geocentric learning sphere."], cases: ["Reason through real ambiguity", "Cases include contradiction, uncertainty and alternative expression."], practice: ["Turn recognition into skill", "Answer, explain and revise rather than merely reading."], notebook: ["Keep a reasoning journal", "Save observations and hypotheses privately on this device."], glossary: ["Build a precise vocabulary", "Search Sanskrit terms and plain-English definitions."], settings: ["Set the calculation and learning model", "Every astronomical and tradition-dependent choice stays explicit."],
  };

  return <main className={styles.shell} data-density={workspace.settings.density} data-contrast={workspace.settings.contrast}>
    <a className={styles.skip} href="#workspace-main">Skip to learning workspace</a>
    <header className={styles.topbar}>
      <button className={styles.brand} type="button" onClick={() => setSection("learn")}><span className={styles.brandMark}>D</span><span><strong>Drishti</strong><small>Jyotish reasoning laboratory</small></span></button>
      <WorkspaceNav active={section} onChange={setSection} />
      <div className={styles.sessionReadout}><span>{birth.name} · {birth.reliability} time</span><b>{SIGNS[natal.ascendantSign]} Lagna · {selected.name} selected</b></div>
    </header>
    <section className={styles.birthDock} aria-labelledby="birth-title">
      <div className={styles.birthIntro}><span>01</span><div><h1 id="birth-title">Create a working chart</h1><p>Birth data remains local unless you export it.</p></div></div>
      <form className={styles.birthForm} onSubmit={generate}>
        <label>Name<input value={birthDraft.name} onChange={(event) => setBirthDraft({ ...birthDraft, name: event.target.value })} /></label>
        <label>Date<input required type="date" value={birthDraft.date} onChange={(event) => setBirthDraft({ ...birthDraft, date: event.target.value })} /></label>
        <label>Time<input required type="time" value={birthDraft.time} onChange={(event) => setBirthDraft({ ...birthDraft, time: event.target.value })} /></label>
        <PlaceSearch value={birthDraft.place} onChange={(place) => setBirthDraft({ ...birthDraft, place })} />
        <label>Time reliability<select value={birthDraft.reliability} onChange={(event) => setBirthDraft({ ...birthDraft, reliability: event.target.value as BirthDraft["reliability"] })}><option value="exact">Exact certificate</option><option value="recalled">Family recalled</option><option value="rounded">Rounded time</option><option value="approximate">Approximate range</option><option value="unknown">Unknown</option></select></label>
        <button type="submit">Generate chart</button>
      </form>
    </section>
    <div className={styles.main} id="workspace-main">
      <header className={styles.workspaceHead}><div className={styles.workspaceTitle}><p>{section}</p><h2>{workspaceTitles[section][0]}</h2><span>{workspaceTitles[section][1]}</span></div><div className={styles.trustLegend}><span>Astronomical fact</span><span>Traditional rule</span><span>Interpretive hypothesis</span></div></header>

      {section === "learn" && <div className={styles.lessonLayout}>
        <aside className={styles.panel}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Foundations</p><h3>{Object.values(workspace.progress).filter((item) => item.completed).length} of 12 complete</h3></div></div><div className={styles.lessonList} role="tablist" aria-label="Foundation lessons">{foundationModules.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={lessonIndex === index} onClick={() => { setLessonIndex(index); setLessonAnswer(null); }}><span>{String(item.order).padStart(2, "0")}</span><b>{item.title}</b></button>)}</div></aside>
        <article className={`${styles.panel} ${styles.lessonBody}`} role="tabpanel"><span className={styles.typeBadge} data-kind={lesson.source.knowledgeType}>{knowledgeTaxonomy[lesson.source.knowledgeType].label} · {lesson.source.tradition}</span><h3>{lesson.title}</h3><div className={styles.objective}><b>Learning objective:</b> {lesson.objective}</div><p>{lesson.explanation}</p><ul className={styles.reasoningSteps}>{lesson.principles.map((principle) => <li key={principle}>{principle}</li>)}</ul><div className={styles.exercise}><h4>Try this in the chart</h4><p>{lesson.interactivePrompt}</p><button type="button" onClick={() => setSection("chart")}>Open chart lab</button></div><div className={styles.exercise}><h4>Worked example · {lesson.workedExample.setup}</h4><ol className={styles.reasoningSteps}>{lesson.workedExample.reasoning.map((step) => <li key={step}>{step}</li>)}</ol><p><b>Synthesis:</b> {lesson.workedExample.synthesis}</p></div><div className={styles.warning}><b>Common mistake:</b> {lesson.commonMistake}</div></article>
        <aside className={styles.panel}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Mastery check</p><h3>Test the principle</h3></div></div><p>{lesson.masteryQuestion.prompt}</p><div className={styles.mastery}>{lesson.masteryQuestion.choices.map((choice, index) => <button key={choice} type="button" onClick={() => { setLessonAnswer(index); if (index === lesson.masteryQuestion.answer) completeLesson(); }}>{choice}</button>)}</div>{lessonAnswer !== null && <div className={styles.feedback}><b>{lessonAnswer === lesson.masteryQuestion.answer ? "Correct reasoning." : "Reconsider the layers."}</b><br />{lesson.masteryQuestion.feedback}</div>}<hr /><p className={styles.eyebrow}>Learning paths</p>{curriculumPaths.map((path) => <div className={styles.factLine} key={path.id}><span>{path.level}</span><b>{path.title}</b></div>)}</aside>
      </div>}

      {section === "chart" && <div className={styles.gridChart}>
        <section className={`${styles.panel} ${styles.stack}`}><div className={styles.panelHead}><div><p className={styles.eyebrow}>North Indian chart</p><h3>{birth.name} · {chartView}</h3><p>House 1 remains at the top; houses move counter-clockwise and rāśi signs rotate from the selected Lagna frame.</p></div><button type="button" onClick={saveChart}>Save chart</button></div><div className={styles.segmented} aria-label="Chart comparison views">{(["D1", "D9", "D10", "chandra"] as const).map((view) => <button key={view} type="button" aria-pressed={chartView === view} onClick={() => setChartView(view)}>{view === "chandra" ? "Moon Lagna" : view}</button>)}<button type="button" aria-pressed={showTransit} onClick={() => setShowTransit((value) => !value)}>Transit overlay</button></div><NorthIndianChart ascendantSign={displayAscSign} planets={displayPlanets} aspects={chartView === "D1" ? chartAspects : []} selectedHouse={selectedHouse} selectedPlanetId={`natal-${selectedPlanet}`} labelMode="full" showTransits={showTransit} onHouseSelect={setSelectedHouse} onSignSelect={(_, house) => setSelectedHouse(house)} onPlanetSelect={(planet) => choosePlanet(planet.name)} /></section>
        <aside className={styles.stack}>
          <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Select a graha</p><h3>Placement inspector</h3></div></div><div className={styles.planetGrid}>{natal.positions.map((planet) => <button key={planet.name} type="button" aria-pressed={planet.name === selectedPlanet} onClick={() => choosePlanet(planet.name)}><b>{planetShort[planet.name]} · {planet.name}</b><span>H{planet.house} · {SIGNS[planet.sign]}</span></button>)}</div></section>
          <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Astronomical fact</p><h3>{selected.name} in {SIGNS[selected.sign]}</h3><p>{degree(selected.degree)} · H{selected.house} · {selected.retrograde ? "Retrograde" : "Direct"}</p></div></div><div className={styles.inspectorGrid}><div className={styles.factLine}><span>Nakṣatra</span><b>{selected.nakshatra.name} · Pada {selected.nakshatra.pada} · {selected.nakshatra.lord} ruled</b></div><div className={styles.factLine}><span>Nakṣatra logic</span><b>{selectedNakshatraProfile.deity} · {selectedNakshatraProfile.symbol} · {selectedNakshatraProfile.padas[selected.nakshatra.pada - 1].hook}</b></div><div className={styles.factLine}><span>Selected field</span><b>H{selectedHouse} · {selectedHouseProfile.title} · {selectedHouseProfile.classifications.join(", ")}</b></div><div className={styles.factLine}><span>Vargas</span><b>D9 {SIGNS[selected.vargas.D9]} · D10 {SIGNS[selected.vargas.D10]}</b></div><div className={styles.factLine}><span>Dignity</span><b>{selectedDignity.label} · {selectedDignity.explanation}</b></div><div className={styles.factLine}><span>Natural role</span><b>{selectedProfile.role}</b></div><div className={styles.factLine}><span>Functional role</span><b>{selectedFunctional?.labels.join(" · ") || "Judge nodes through dispositors and contacts"}</b></div></div></section>
          <section className={styles.panel}><p className={styles.eyebrow}>Generative derivation</p><div className={styles.derivation}><span>H{selected.house}: {HOUSE_TOPICS[selected.house - 1]}</span><i>+</i><span>{selected.name}: {selectedProfile.role}</span><i>+</i><span>{SIGNS[selected.sign]}: {signProfiles[selected.sign].style}</span></div><p>{selectedProfile.teachingHook}</p><div className={styles.chipRow}>{selectedAspects.map((aspect) => <button type="button" key={aspect.count} aria-pressed={selectedHouse === aspect.targetHouse} onClick={() => setSelectedHouse(aspect.targetHouse)}>{aspect.count}th → H{aspect.targetHouse}</button>)}</div></section>
        </aside>
      </div>}

      {section === "synthesis" && <div className={styles.grid2}>
        <EvidenceTrail claim={synthesis.claim} evidence={evidenceItems} confidence={synthesis.confidence === "strongly-repeated" ? "high" : synthesis.confidence} tradition="Parāśari-oriented whole-sign teaching model" statementType="interpretive hypothesis" caveat={synthesis.limits.join(" ")} onEvidenceSelect={(item) => { const house = Number(item.id.match(/house-(\d+)/)?.[1]); if (house) { setSelectedHouse(house); setSection("chart"); } }} />
        <div className={styles.stack}><section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Dispositor dependency</p><h3>{selected.name}’s chain</h3></div></div><div className={styles.dispositor}>{selectedDispositor.steps.map((step, index) => <span key={`${step.planet}-${index}`}>{step.planet} → {step.dispositor} in H{step.dispositorHouse}</span>)}</div>{selectedDispositor.finalDispositor && <p>Final dispositor: <b>{selectedDispositor.finalDispositor}</b></p>}{selectedDispositor.cycle && <p>Closed exchange: {selectedDispositor.cycle.join(" → ")}</p>}</section><section className={styles.panel}><p className={styles.eyebrow}>Functional roles</p>{roles.map((role) => <div className={styles.factLine} key={role.planet}><span>{role.planet}</span><b>H{role.ruledHouses.join(" & H")} · {role.labels.join(", ") || "contextual"}</b></div>)}</section><section className={styles.panel}><p className={styles.eyebrow}>Yoga candidates · inspect, never declare</p>{yogaCandidates.length ? yogaCandidates.slice(0, 5).map((yoga) => <div className={styles.exercise} key={yoga.id}><h4>{yoga.name}</h4><p>{yoga.evidence.join(" ")}</p><small>{yoga.cautions.join(" ")}</small></div>) : <p>No candidate from the current transparent starter rules.</p>}</section><section className={styles.panel}><p className={styles.eyebrow}>Deśa · kāla · pātra context</p><div className={styles.contextForm}><label>Life stage<input value={context.lifeStage} onChange={(event) => setContext({ ...context, lifeStage: event.target.value })} /></label><label>Work context<input value={context.work} onChange={(event) => setContext({ ...context, work: event.target.value })} /></label><label>Relationship context<input value={context.relationships} onChange={(event) => setContext({ ...context, relationships: event.target.value })} /></label><label>Known events<textarea value={context.knownEvents} onChange={(event) => setContext({ ...context, knownEvents: event.target.value })} /></label></div></section></div>
      </div>}

      {section === "timing" && <div className={styles.stack}>
        <section className={`${styles.panel} ${styles.timingHero}`}><div><div className={styles.panelHead}><div><p className={styles.eyebrow}>Timing laboratory</p><h3>{effectiveTransitDate} · {activeDasha.maha?.lord ?? "—"}/{activeDasha.antar?.lord ?? "—"}</h3><p>Daśā supplies the active natal agents; transits show temporary activation and exact contacts.</p></div></div><div className={styles.dateControls}><label>Transit date<input type="date" value={transitDateText} onChange={(event) => { setTransitDateText(event.target.value); setTransitMonths(0); }} /></label><label>Time UTC<input type="time" value={transitTime} onChange={(event) => setTransitTime(event.target.value)} /></label><label>Scale<select value={timeScale} onChange={(event) => { setTimeScale(event.target.value as typeof timeScale); setTransitMonths(0); }}><option value="day">Day</option><option value="week">Week</option><option value="month">Month</option><option value="year">Year</option><option value="30year">30 years</option></select></label><button type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play time"}</button></div>{(timeScale === "30year" || timeScale === "year") && <div className={styles.timeline}><input aria-label="Transit month offset" type="range" min="0" max={timeScale === "30year" ? 360 : 12} value={transitMonths} onChange={(event) => setTransitMonths(Number(event.target.value))} /><div className={styles.timelineTicks}><span>Start</span><span>{Math.floor(transitMonths / 12)}y {transitMonths % 12}m ahead</span><span>{timeScale === "30year" ? "30 years" : "1 year"}</span></div></div>}</div><div className={styles.claim}><span>Selected transit</span><p>{selected.name} moves through H{selectedTransit.house}, {SIGNS[selectedTransit.sign]}, during {activeDasha.maha?.lord ?? "an unlocated"} mahādaśā. This is an activation condition, not an event verdict.</p></div></section>
        <div className={styles.grid2}><section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Nested Vimśottarī periods</p><h3>Daśā timeline</h3></div></div><div className={styles.dashaBand}>{dashas.filter((period) => period.end >= birthUtc && period.start <= new Date(birthUtc.getTime() + 85 * 365.2425 * 86400000)).slice(0, 9).map((period) => <div key={`${period.lord}-${period.start.toISOString()}`}><b>{period.lord}</b><span>{period.displayStart.getUTCFullYear()}–{period.end.getUTCFullYear()}</span><time>{period === activeDasha.maha ? "Active" : `${period.antardashas.length} subperiods`}</time></div>)}</div></section><section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Exact and sign-based contacts</p><h3>Why this window matters</h3></div></div><div className={styles.transitMatrix}>{contacts.slice(0, 18).map((contact, index) => <button key={`${contact.transitPlanet}-${contact.kind}-${contact.natalPlanet ?? contact.natalHouse}-${index}`} type="button" aria-pressed={contact.transitPlanet === selectedPlanet} onClick={() => choosePlanet(contact.transitPlanet)}><b>{contact.transitPlanet} · {contact.kind.replace("-", " ")}</b><span>{contact.natalPlanet ? `Natal ${contact.natalPlanet}` : `Natal H${contact.natalHouse}`} · {contact.exactness}{contact.separation !== undefined ? ` · ${contact.separation.toFixed(2)}° ${contact.applying ? "applying" : "separating"}` : ""}</span></button>)}</div></section></div>
        <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Responsible event window</p><h3>From activation to alternatives</h3></div></div><div className={styles.grid2}><div><h4>Background</h4><p>{activeDasha.maha?.lord ?? "Unknown"} mahādaśā and {activeDasha.antar?.lord ?? "unknown"} antardaśā foreground their natal houses, lordships and condition.</p><h4>Shorter trigger</h4><p>{selected.name} is now in H{selectedTransit.house}; inspect repeated contacts above.</p></div><div><h4>Possible expressions</h4><p>Formalisation, renegotiation, additional responsibility, clearer boundaries, delay or sustained practice are alternative expressions. Context determines which is plausible.</p><h4>Cannot infer from this alone</h4><p>A marriage, separation, diagnosis, financial result or other single inevitable event.</p></div></div></section>
      </div>}

      {section === "sky" && <SkySphere planets={(showTransit ? transit : natal).positions.map((planet) => ({ id: planet.name, name: planet.name, shortLabel: planetShort[planet.name], longitude: planet.longitude, color: planetColor[planet.name], metadata: `${planet.nakshatra.name} pada ${planet.nakshatra.pada} · H${planet.house}` }))} selectedPlanetId={selectedPlanet} enabledLayers={["zodiac", "ecliptic", "horizon", "equator", "nakshatras"]} onPlanetSelect={(planet) => choosePlanet(planet.name)} title={`${showTransit ? "Transit" : "Birth"} geocentric learning sky`} />}

      {section === "cases" && <div className={styles.grid2}><section className={styles.panel}><div className={styles.caseGrid}>{caseStudies.map((item) => <article className={styles.caseCard} key={item.id}><p className={styles.eyebrow}>{item.level} · time confidence {item.birthTimeConfidence}</p><h3>{item.title}</h3><p>{item.context}</p><button type="button" onClick={() => setCaseId(item.id)}>Study this case</button></article>)}</div></section>{activeCase && <article className={`${styles.panel} ${styles.lessonBody}`}><p className={styles.eyebrow}>Active case</p><h3>{activeCase.title}</h3><p>{activeCase.context}</p><div className={styles.exercise}><h4>Placements</h4>{activeCase.placements.map((item) => <p key={item}>• {item}</p>)}</div><div className={styles.exercise}><h4>Reasoning tensions</h4>{activeCase.tensions.map((item) => <p key={item}>± {item}</p>)}</div><ol className={styles.reasoningSteps}>{activeCase.prompts.map((item) => <li key={item}>{item}</li>)}</ol><EvidenceTrail claim={activeCase.modelSynthesis} evidence={activeCase.evidence.map((item, index) => ({ id: `${activeCase.id}-${index}`, kind: item.direction === "supports" ? "supporting" : item.direction === "modifies" ? "modifying" : "counter", statement: item.statement }))} confidence="mixed" caveat={activeCase.timingCaution} /></article>}</div>}

      {section === "practice" && practice && <section className={`${styles.panel} ${styles.practiceCard}`}><div className={styles.panelHead}><div><p className={styles.eyebrow}>{practice.level} · {practice.format}</p><h3>{practice.prompt}</h3></div><span>{practiceIndex + 1}/{practiceQuestions.length}</span></div>{practice.choices ? <div className={styles.practiceChoices}>{practice.choices.map((choice, index) => <button type="button" key={choice} onClick={() => setPracticeAnswer(index)}>{choice}</button>)}</div> : <div className={styles.writtenPractice}><textarea rows={6} placeholder="Write a concise reasoning chain, then reveal the rubric." /><button type="button" onClick={() => setPracticeAnswer(-1)}>Reveal model rubric</button></div>}{practiceAnswer !== null && <div className={styles.feedback}><b>{practice.choices ? (String(practice.answer) === String(practiceAnswer) ? "Correct." : "Compare your reasoning with the rule.") : "Model reasoning rubric"}</b><br />{practice.explanation}<ul>{practice.rubric.map((item) => <li key={item}>{item}</li>)}</ul></div>}<div className={styles.segmented}><button type="button" onClick={() => { setPracticeIndex((index) => (index + practiceQuestions.length - 1) % practiceQuestions.length); setPracticeAnswer(null); }}>Previous</button><button type="button" onClick={() => { setPracticeIndex((index) => (index + 1) % practiceQuestions.length); setPracticeAnswer(null); }}>Next exercise</button></div></section>}

      {section === "notebook" && <NotebookPanel entries={workspace.notebook} chartId={`${birth.name}-${birth.date}-${birth.time}`} onAdd={(entry) => setWorkspace((current) => ({ ...current, notebook: [entry, ...current.notebook] }))} onDelete={(id) => setWorkspace((current) => ({ ...current, notebook: current.notebook.filter((entry) => entry.id !== id) }))} />}

      {section === "glossary" && <section className={styles.panel}><div className={styles.searchBar}><input aria-label="Search Jyotish glossary" placeholder="Search rāśi, dṛṣṭi, daśā…" value={glossaryQuery} onChange={(event) => setGlossaryQuery(event.target.value)} /><span>{filteredGlossary.length} terms</span></div><div className={styles.glossaryGrid}>{filteredGlossary.map((entry) => <article className={styles.termCard} key={entry.term}><p className={styles.eyebrow}>{entry.category}</p><h3>{entry.transliteration}</h3><p>{entry.devanagari && <>{entry.devanagari} · </>}{entry.plainEnglish}</p><small>Related: {entry.related.join(", ")}</small></article>)}</div></section>}

      {section === "settings" && <div className={styles.settingGrid}><section className={styles.settingCard}><h3>Calculation model</h3><label>Ayanāṃśa<select value={settings.ayanamsha} onChange={(event) => setSettings({ ...settings, ayanamsha: event.target.value as AyanamshaId })}>{Object.entries(AYANAMSHA_METADATA).map(([id, meta]) => <option key={id} value={id}>{meta.label}</option>)}</select></label><label>Node model<select value={settings.nodeMode} onChange={(event) => setSettings({ ...settings, nodeMode: event.target.value as CalculationSettings["nodeMode"] })}><option value="mean">Mean nodes</option><option value="true">True nodes (explicit fallback)</option></select></label><div className={styles.warning}>{AYANAMSHA_METADATA[settings.ayanamsha].note}</div>{natal.warnings.map((warning) => <p key={warning.code}>{warning.message}</p>)}</section><section className={styles.settingCard}><h3>Learning display</h3><label>Density<select value={workspace.settings.density} onChange={(event) => setWorkspace((current) => ({ ...current, settings: { ...current.settings, density: event.target.value as WorkspaceSnapshot["settings"]["density"] } }))}><option value="comfortable">Comfortable reading</option><option value="compact">Compact</option></select></label><label>Contrast<select value={workspace.settings.contrast} onChange={(event) => setWorkspace((current) => ({ ...current, settings: { ...current.settings, contrast: event.target.value as WorkspaceSnapshot["settings"]["contrast"] } }))}><option value="standard">Standard</option><option value="high">High contrast</option></select></label><label>Transliteration<select value={workspace.settings.transliteration} onChange={(event) => setWorkspace((current) => ({ ...current, settings: { ...current.settings, transliteration: event.target.value as WorkspaceSnapshot["settings"]["transliteration"] } }))}><option value="diacritics">Sanskrit diacritics</option><option value="plain">Plain Latin</option></select></label></section><section className={styles.settingCard}><h3>Custom coordinates</h3><label>Latitude<input type="number" step="0.0001" value={birthDraft.place.latitude} onChange={(event) => setBirthDraft({ ...birthDraft, place: { ...birthDraft.place, id: "custom", label: "Custom coordinates", country: "", latitude: Number(event.target.value) } })} /></label><label>Longitude<input type="number" step="0.0001" value={birthDraft.place.longitude} onChange={(event) => setBirthDraft({ ...birthDraft, place: { ...birthDraft.place, id: "custom", label: "Custom coordinates", country: "", longitude: Number(event.target.value) } })} /></label><label>IANA timezone<input value={birthDraft.place.timeZone} onChange={(event) => setBirthDraft({ ...birthDraft, place: { ...birthDraft.place, id: "custom", label: "Custom coordinates", country: "", timeZone: event.target.value } })} /></label></section><section className={styles.settingCard}><h3>Private workspace</h3><p>{workspace.charts.length} saved charts · {workspace.notebook.length} notes · {Object.values(workspace.progress).filter((item) => item.completed).length} lessons complete</p><button type="button" onClick={downloadWorkspace}>Export local workspace JSON</button><div className={styles.warning}>Birth data and notes are stored only in this browser profile. Clearing site data removes them unless exported.</div></section></div>}
      {section === "settings" && <section className={`${styles.panel} ${styles.portabilityPanel}`}><div className={styles.panelHead}><div><p className={styles.eyebrow}>Portability</p><h3>Saved charts and local backups</h3><p>Restore a chart, move your private workspace between browsers, or print the current learning report.</p></div></div><div className={styles.workspaceActions}><button type="button" onClick={downloadWorkspace}>Export workspace</button><label className={styles.fileButton}>Import workspace<input type="file" accept="application/json,.json" onChange={importWorkspaceFile} /></label><button type="button" onClick={() => window.print()}>Print chart / report</button></div>{workspace.charts.length > 0 ? <div className={styles.savedCharts}>{workspace.charts.map((chart) => <div key={chart.id}><button type="button" onClick={() => loadStoredChart(chart)}><b>{chart.name}</b><span>{chart.date} · {chart.placeLabel}</span></button><button type="button" aria-label={`Delete ${chart.name}`} onClick={() => setWorkspace((current) => ({ ...current, charts: current.charts.filter((item) => item.id !== chart.id) }))}>×</button></div>)}</div> : <p className={styles.emptyState}>No saved charts yet. Generate a chart and choose “Save chart” in the Chart Lab.</p>}</section>}
    </div>
    <footer className={styles.footer}><strong>Drishti · transparent Jyotish learning</strong><span>Calculated coordinates, inherited rules and interpretive hypotheses are deliberately kept separate.</span><span>Educational, non-deterministic and learning-grade.</span></footer>
  </main>;
}
