"use client";

import { FormEvent, useMemo, useState } from "react";
import { Body, Ecliptic, GeoVector, SiderealTime } from "astronomy-engine";

type PlanetName =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Rahu"
  | "Ketu";

type PlanetPosition = {
  name: PlanetName;
  short: string;
  longitude: number;
  sign: number;
  degree: number;
  house: number;
  retrograde: boolean;
};

type BirthData = {
  name: string;
  date: string;
  time: string;
  city: string;
};

const cities = {
  kolkata: { label: "Kolkata, India", lat: 22.5726, lon: 88.3639, offset: 330 },
  delhi: { label: "New Delhi, India", lat: 28.6139, lon: 77.209, offset: 330 },
  mumbai: { label: "Mumbai, India", lat: 19.076, lon: 72.8777, offset: 330 },
  bengaluru: { label: "Bengaluru, India", lat: 12.9716, lon: 77.5946, offset: 330 },
  chennai: { label: "Chennai, India", lat: 13.0827, lon: 80.2707, offset: 330 },
  kathmandu: { label: "Kathmandu, Nepal", lat: 27.7172, lon: 85.324, offset: 345 },
  london: { label: "London, UK", lat: 51.5072, lon: -0.1276, offset: 60 },
  newyork: { label: "New York, USA", lat: 40.7128, lon: -74.006, offset: -240 },
  singapore: { label: "Singapore", lat: 1.3521, lon: 103.8198, offset: 480 },
} as const;

const signs = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const signShort = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

const houseAreas = [
  "self, body and direction",
  "resources, speech and values",
  "effort, courage and skills",
  "home, roots and inner steadiness",
  "creativity, learning and discernment",
  "work, health and problem-solving",
  "partnerships and agreements",
  "change, vulnerability and shared resources",
  "meaning, teachers and long journeys",
  "work, responsibility and public contribution",
  "communities, gains and long-term aims",
  "release, retreat and what lies beyond view",
];

const planetActors: Record<PlanetName, string> = {
  Sun: "identity, vitality and authority",
  Moon: "mind, feeling and responsiveness",
  Mercury: "analysis, language and exchange",
  Venus: "harmony, attraction and relating",
  Mars: "drive, courage and decisive action",
  Jupiter: "growth, meaning and guidance",
  Saturn: "structure, patience and accountability",
  Rahu: "amplification, appetite and unfamiliar territory",
  Ketu: "detachment, refinement and inherited skill",
};

const signStyles = [
  "direct and initiating", "steady and material", "curious and adaptive",
  "protective and feeling-led", "expressive and self-assured", "precise and improving",
  "relational and balancing", "intense and investigative", "expansive and principle-led",
  "disciplined and pragmatic", "systemic and future-facing", "receptive and imaginative",
];

const aspectRules: Record<PlanetName, number[]> = {
  Sun: [7], Moon: [7], Mercury: [7], Venus: [7],
  Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10],
  Rahu: [5, 7, 9], Ketu: [5, 7, 9],
};

const bodies: Array<{ name: Exclude<PlanetName, "Rahu" | "Ketu">; short: string; body: Body }> = [
  { name: "Sun", short: "Su", body: Body.Sun },
  { name: "Moon", short: "Mo", body: Body.Moon },
  { name: "Mercury", short: "Me", body: Body.Mercury },
  { name: "Venus", short: "Ve", body: Body.Venus },
  { name: "Mars", short: "Ma", body: Body.Mars },
  { name: "Jupiter", short: "Ju", body: Body.Jupiter },
  { name: "Saturn", short: "Sa", body: Body.Saturn },
];

const housePoints = [
  [50, 35], [24, 12], [12, 28], [35, 50], [12, 72], [24, 88],
  [50, 65], [76, 88], [88, 72], [65, 50], [88, 28], [76, 12],
];

function normalize(value: number) {
  return ((value % 360) + 360) % 360;
}

function signedDelta(a: number, b: number) {
  return ((a - b + 540) % 360) - 180;
}

function ayanamsha(date: Date) {
  const year = date.getUTCFullYear() + date.getUTCMonth() / 12;
  return 23.85675 + (year - 2000) * 0.01397;
}

function planetLongitude(body: Body, date: Date) {
  return normalize(Ecliptic(GeoVector(body, date, true)).elon - ayanamsha(date));
}

function nodeLongitude(date: Date) {
  const days = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;
  const tropicalNode = 125.04452 - 0.0529538083 * days;
  return normalize(tropicalNode - ayanamsha(date));
}

function ascendantLongitude(date: Date, latitude: number, longitude: number) {
  const siderealRadians = ((SiderealTime(date) + longitude / 15) * 15 * Math.PI) / 180;
  const latitudeRadians = (latitude * Math.PI) / 180;
  const obliquity = (23.4393 * Math.PI) / 180;
  const tropical = Math.atan2(
    -Math.cos(siderealRadians),
    Math.sin(siderealRadians) * Math.cos(obliquity) + Math.tan(latitudeRadians) * Math.sin(obliquity),
  );
  return normalize((tropical * 180) / Math.PI - ayanamsha(date));
}

function toUtcDate(data: BirthData) {
  const [year, month, day] = data.date.split("-").map(Number);
  const [hour, minute] = data.time.split(":").map(Number);
  const place = cities[data.city as keyof typeof cities] ?? cities.kolkata;
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - place.offset * 60000);
}

function calculateChart(date: Date, latitude: number, longitude: number, fixedAscSign?: number) {
  const ascLongitude = ascendantLongitude(date, latitude, longitude);
  const ascSign = fixedAscSign ?? Math.floor(ascLongitude / 30);
  const positions: PlanetPosition[] = bodies.map(({ name, short, body }) => {
    const longitudeNow = planetLongitude(body, date);
    const tomorrow = planetLongitude(body, new Date(date.getTime() + 86400000));
    const sign = Math.floor(longitudeNow / 30);
    return {
      name,
      short,
      longitude: longitudeNow,
      sign,
      degree: longitudeNow % 30,
      house: ((sign - ascSign + 12) % 12) + 1,
      retrograde: !["Sun", "Moon"].includes(name) && signedDelta(tomorrow, longitudeNow) < 0,
    };
  });
  const rahuLongitude = nodeLongitude(date);
  const ketuLongitude = normalize(rahuLongitude + 180);
  positions.push(
    { name: "Rahu", short: "Ra", longitude: rahuLongitude, sign: Math.floor(rahuLongitude / 30), degree: rahuLongitude % 30, house: ((Math.floor(rahuLongitude / 30) - ascSign + 12) % 12) + 1, retrograde: true },
    { name: "Ketu", short: "Ke", longitude: ketuLongitude, sign: Math.floor(ketuLongitude / 30), degree: ketuLongitude % 30, house: ((Math.floor(ketuLongitude / 30) - ascSign + 12) % 12) + 1, retrograde: true },
  );
  return { ascLongitude, ascSign, positions };
}

function formatDegree(value: number) {
  const degrees = Math.floor(value);
  const minutes = Math.floor((value - degrees) * 60);
  return `${degrees}° ${String(minutes).padStart(2, "0")}′`;
}

function ordinal(value: number) {
  if (value === 1) return "1st";
  if (value === 2) return "2nd";
  if (value === 3) return "3rd";
  return `${value}th`;
}

const initialBirth: BirthData = { name: "Arun", date: "1992-07-14", time: "10:32", city: "kolkata" };

export default function Home() {
  const [draft, setDraft] = useState(initialBirth);
  const [birth, setBirth] = useState(initialBirth);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetName>("Saturn");
  const [selectedAspect, setSelectedAspect] = useState(7);
  const [transitDay, setTransitDay] = useState(0);
  const [showTransits, setShowTransits] = useState(true);
  const [generatedMessage, setGeneratedMessage] = useState("Chart ready");

  const place = cities[birth.city as keyof typeof cities] ?? cities.kolkata;
  const birthDate = useMemo(() => toUtcDate(birth), [birth]);
  const natal = useMemo(() => calculateChart(birthDate, place.lat, place.lon), [birthDate, place.lat, place.lon]);
  const transitDate = useMemo(() => new Date(Date.UTC(2026, 6, 14 + transitDay, 12)), [transitDay]);
  const transit = useMemo(
    () => calculateChart(transitDate, place.lat, place.lon, natal.ascSign),
    [transitDate, place.lat, place.lon, natal.ascSign],
  );
  const selected = natal.positions.find((planet) => planet.name === selectedPlanet) ?? natal.positions[6];
  const selectedTransit = transit.positions.find((planet) => planet.name === selectedPlanet) ?? transit.positions[6];
  const aspects = aspectRules[selected.name];
  const activeAspect = aspects.includes(selectedAspect) ? selectedAspect : aspects[0];
  const aspectHouse = ((selected.house + activeAspect - 2) % 12) + 1;

  function generate(event: FormEvent) {
    event.preventDefault();
    setBirth(draft);
    setGeneratedMessage(`Generated for ${draft.name || "this person"}`);
  }

  function choosePlanet(name: PlanetName) {
    setSelectedPlanet(name);
    setSelectedAspect(aspectRules[name][0]);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#workspace" aria-label="Drishti home">
          <span className="brand-mark">D</span>
          <span><strong>Drishti</strong><small>Jyotish, made visible</small></span>
        </a>
        <div className="learning-path" aria-label="Learning progress">
          <span className="path-step is-done">1. Enter birth details</span>
          <span className="path-line" aria-hidden="true" />
          <span className="path-step is-active">2. Explore the chart</span>
          <span className="path-line" aria-hidden="true" />
          <span className="path-step">3. Move through time</span>
        </div>
        <div className="lesson-count"><span>Lesson 3 of 12</span><i><b /></i></div>
      </header>

      <section className="birth-strip" aria-labelledby="birth-title">
        <div className="birth-intro">
          <span className="step-number">01</span>
          <div><p className="eyebrow">Start with a real sky</p><h1 id="birth-title">Create a birth chart</h1></div>
        </div>
        <form className="birth-form" onSubmit={generate}>
          <label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
          <label>Date of birth<input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required /></label>
          <label>Time of birth<input type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} required /></label>
          <label>Birth place<select value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })}>{Object.entries(cities).map(([key, city]) => <option key={key} value={key}>{city.label}</option>)}</select></label>
          <button className="primary-button" type="submit">Generate chart</button>
          <span className="form-status" role="status">{generatedMessage}</span>
        </form>
      </section>

      <section className="workspace" id="workspace">
        <aside className="lesson-rail" aria-label="Current lesson">
          <p className="eyebrow">The minimum grammar</p>
          <h2>Read any placement with three ideas.</h2>
          <div className="grammar-list">
            <button className="grammar-row is-current" type="button"><span>1</span><div><b>House</b><small>Where in life?</small></div></button>
            <button className="grammar-row" type="button"><span>2</span><div><b>Planet</b><small>Which actor?</small></div></button>
            <button className="grammar-row" type="button"><span>3</span><div><b>Sign</b><small>Acting in what style?</small></div></button>
          </div>
          <div className="formula-card"><span>HOUSE</span><i>+</i><span>PLANET</span><i>+</i><span>SIGN</span><strong>= a readable sentence</strong></div>
          <div className="rail-note"><b>Learning mode</b><p>Planetary longitudes are calculated astronomically and converted to an approximate Lahiri sidereal zodiac. Use professional ephemeris software for consultation-grade work.</p></div>
        </aside>

        <section className="chart-workspace" aria-labelledby="chart-title">
          <div className="section-heading">
            <div><p className="eyebrow">02 · Explore the chart</p><h2 id="chart-title">{birth.name || "Birth"}’s chart</h2><p>{place.label} · {new Date(`${birth.date}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {birth.time}</p></div>
            <label className="toggle"><input type="checkbox" checked={showTransits} onChange={(event) => setShowTransits(event.target.checked)} /><span aria-hidden="true" />Show transits</label>
          </div>

          <div className="chart-and-planets">
            <div className="chart-wrap">
              <div className="kundli" role="img" aria-label={`Twelve-house North Indian birth chart for ${birth.name}`}>
                <span className="chart-diagonal diagonal-one" aria-hidden="true" />
                <span className="chart-diagonal diagonal-two" aria-hidden="true" />
                <span className="central-diamond" aria-hidden="true" />
                {housePoints.map(([left, top], index) => {
                  const house = index + 1;
                  const natalPlanets = natal.positions.filter((planet) => planet.house === house);
                  const transitPlanets = transit.positions.filter((planet) => planet.house === house);
                  const sign = (natal.ascSign + index) % 12;
                  const isAspectTarget = house === aspectHouse;
                  return (
                    <div className={`house-cell house-${house}${isAspectTarget ? " is-aspected" : ""}`} style={{ left: `${left}%`, top: `${top}%` }} key={house}>
                      <span className="house-meta">H{house} · {signShort[sign]}</span>
                      <div className="house-planets">
                        {natalPlanets.map((planet) => <button key={planet.name} type="button" className={`chart-planet${planet.name === selected.name ? " is-selected" : ""}`} aria-label={`Select ${planet.name} in house ${house}`} onClick={() => choosePlanet(planet.name)}>{planet.short}{planet.retrograde ? "ᴿ" : ""}</button>)}
                        {showTransits && transitPlanets.map((planet) => <span key={`t-${planet.name}`} className="transit-planet" aria-label={`Transiting ${planet.name}`}>t{planet.short}</span>)}
                      </div>
                    </div>
                  );
                })}
                <div className="chart-center"><b>{signs[natal.ascSign]} rising</b><span>{formatDegree(natal.ascLongitude % 30)}</span></div>
              </div>
              <p className="chart-caption"><span className="natal-key" /> Natal position <span className="transit-key" /> Transit position</p>
            </div>

            <div className="planet-picker" aria-label="Select a planet">
              <p className="eyebrow">Choose an actor</p>
              {natal.positions.map((planet) => <button type="button" key={planet.name} className={planet.name === selected.name ? "is-selected" : ""} onClick={() => choosePlanet(planet.name)} aria-pressed={planet.name === selected.name}><span>{planet.short}</span><b>{planet.name}</b><small>{signs[planet.sign]} · H{planet.house}</small></button>)}
            </div>
          </div>
        </section>

        <aside className="explanation-panel" aria-live="polite">
          <div className="selection-header"><p className="eyebrow">Selected placement</p><h2>{selected.name} in House {selected.house}</h2><p>{signs[selected.sign]} · {formatDegree(selected.degree)}{selected.retrograde ? " · Retrograde" : ""}</p></div>
          <div className="guided-equation">
            <div><span>1</span><p><b>House {selected.house} is the area</b>{houseAreas[selected.house - 1]}</p></div>
            <div><span>2</span><p><b>{selected.name} is the actor</b>{planetActors[selected.name]}</p></div>
            <div><span>3</span><p><b>{signs[selected.sign]} is the style</b>{signStyles[selected.sign]}</p></div>
          </div>
          <div className="synthesis"><span>Put it together</span><p><b>{selected.name}</b> brings {planetActors[selected.name]} into <b>{houseAreas[selected.house - 1]}</b>, working in a {signStyles[selected.sign]} way.</p></div>
          <div className="aspect-calculator">
            <div className="panel-title"><div><p className="eyebrow">Guided aspect calculator</p><h3>Where does it look?</h3></div><span>{selected.name}</span></div>
            <div className="aspect-tabs">{aspects.map((aspect) => <button type="button" key={aspect} className={activeAspect === aspect ? "is-selected" : ""} onClick={() => setSelectedAspect(aspect)}>{ordinal(aspect)} aspect</button>)}</div>
            <p className="aspect-result">From House {selected.house}, count {activeAspect} houses → <b>House {aspectHouse}</b></p>
            <p>{selected.name} carries its {planetActors[selected.name]} toward {houseAreas[aspectHouse - 1]}.</p>
            {(selected.name === "Rahu" || selected.name === "Ketu") && <small className="tradition-note">Node aspects vary by tradition; this view uses the commonly taught 5th, 7th and 9th aspects.</small>}
          </div>
        </aside>
      </section>

      <section className="transit-console" aria-labelledby="transit-title">
        <div className="transit-copy"><span className="step-number">03</span><div><p className="eyebrow">Move through time</p><h2 id="transit-title">Watch the sky meet the chart</h2></div></div>
        <div className="time-control"><div className="time-label"><button type="button" onClick={() => setTransitDay((day) => Math.max(-180, day - 1))} aria-label="Previous day">←</button><b>{transitDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</b><button type="button" onClick={() => setTransitDay((day) => Math.min(180, day + 1))} aria-label="Next day">→</button></div><input aria-label="Transit date" type="range" min="-180" max="180" value={transitDay} onChange={(event) => setTransitDay(Number(event.target.value))} /><div className="range-labels"><span>6 months before</span><button type="button" onClick={() => setTransitDay(0)}>Today · 14 Jul 2026</button><span>6 months after</span></div></div>
        <div className="transit-reading"><span>Transiting {selected.name}</span><b>House {selectedTransit.house} · {signs[selectedTransit.sign]} {formatDegree(selectedTransit.degree)}</b><p>This transit activates {houseAreas[selectedTransit.house - 1]}. Compare the coral “t{selected.short}” marker with the natal {selected.short} marker above.</p></div>
      </section>
    </main>
  );
}
