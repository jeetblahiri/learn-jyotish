import type { CurriculumPath } from "./types";

export const curriculumPaths: CurriculumPath[] = [
  {
    id: "foundations", title: "Foundations: read one placement honestly", level: "foundation", promise: "Build a transparent sentence from calculated placement to conditional interpretation.", prerequisites: [],
    units: [
      { id: "frame", title: "The calculated frame", outcome: "Explain zodiac, ayanamsha, ascendant and birth-time sensitivity.", activities: ["setting toggle", "boundary experiment", "fact/rule/hypothesis sort"] },
      { id: "vocabulary", title: "Actor, field and style", outcome: "Combine graha, house and sign without conflating them.", activities: ["placement composer", "keyword contrast", "worked example"] },
      { id: "structure", title: "Ownership and condition", outcome: "Trace a house lord and qualify the planet’s capacity and agenda.", activities: ["lord trail", "dignity comparison", "dispositor graph"] },
      { id: "relationship", title: "Planetary relationships", outcome: "Separate co-tenancy, conjunction and aspect.", activities: ["degree drag", "aspect counter", "incoming/outgoing overlay"] },
      { id: "responsibility", title: "Bounded interpretation", outcome: "Write a claim with evidence, alternatives and limits.", activities: ["overclaim repair", "safety scenario", "mastery synthesis"] }
    ],
    completionEvidence: "Learner annotates one natal placement with source type, lordship, condition, relationships, alternative expression and uncertainty."
  },
  {
    id: "synthesis", title: "Synthesis: reason across a whole chart", level: "intermediate", promise: "Move from isolated placements to ranked, contradictory and context-aware themes.", prerequisites: ["foundations"],
    units: [
      { id: "house-audit", title: "Four-part house audit", outcome: "Read sign, lord, occupants and influences for any house.", activities: ["empty-house drill", "lordship matrix", "house comparison"] },
      { id: "dependencies", title: "Dispositor networks", outcome: "Identify hubs, loops and weak links.", activities: ["graph trace", "mutual reception case", "final-dispositor critique"] },
      { id: "functional", title: "Functional roles", outcome: "Distinguish natural character from ascendant-specific agenda.", activities: ["ascendant switch", "yogakaraka exercise", "mixed-lord case"] },
      { id: "evidence", title: "Repetition and contradiction", outcome: "Rank independent evidence and preserve counter-indications.", activities: ["evidence board", "tie breaker", "confidence label"] },
      { id: "life-context", title: "Desha-kala-patra", outcome: "Generate plausible expressions for a real life stage without deterministic claims.", activities: ["context cards", "alternative-expression drill", "case synthesis"] }
    ],
    completionEvidence: "Learner produces a whole-chart summary with three ranked themes, an audit trail, contradictions and missing information."
  },
  {
    id: "nakshatra-varga", title: "Nakshatra and varga: zoom without losing context", level: "intermediate", promise: "Use finer subdivisions as contextual refinements rather than isolated personality labels.", prerequisites: ["foundations", "synthesis"],
    units: [
      { id: "nakshatra-grid", title: "The 27-fold lunar zodiac", outcome: "Locate nakshatra, lord, deity, symbol and shakti.", activities: ["zodiac zoom", "mansion sequence", "source-label exercise"] },
      { id: "pada", title: "Pada to navamsha", outcome: "Map each 3°20′ pada to its navamsha sign.", activities: ["degree slider", "pada mapper", "boundary quiz"] },
      { id: "d9", title: "D9 construction and use", outcome: "Describe D9 as a derived chart of dharma and maturation.", activities: ["animated division", "D1/D9 compare", "vargottama check"] },
      { id: "d10", title: "D10 and contribution", outcome: "Compare career promise and professional expression without discarding D1.", activities: ["D1/D10 evidence board", "contradiction case", "role-versus-title drill"] },
      { id: "sensitivity", title: "Birth-time sensitivity", outcome: "Disable or qualify divisional claims that are unstable across the time range.", activities: ["time-range animation", "stable-factor filter", "uncertainty report"] }
    ],
    completionEvidence: "Learner traces one planet from sign to nakshatra, pada and D9, then states what each layer adds and cannot establish."
  },
  {
    id: "timing", title: "Timing: periods, chapters and triggers", level: "advanced", promise: "Construct a timing window by layering natal promise, dasha and transits without predicting certainty.", prerequisites: ["foundations", "synthesis", "nakshatra-varga"],
    units: [
      { id: "vimshottari", title: "Vimshottari sequence", outcome: "Calculate birth balance and navigate major/subperiods.", activities: ["Moon-nakshatra calculation", "nested timeline", "period-lord audit"] },
      { id: "slow-transits", title: "Slow transit chapters", outcome: "Read Saturn, Jupiter and nodes as long-form activation contexts.", activities: ["ingress map", "house/natal-contact overlay", "node-setting comparison"] },
      { id: "passes", title: "Stations and repeated passes", outcome: "Distinguish applying, exact, separating, retrograde and final contacts.", activities: ["motion animation", "three-pass timeline", "event-window journal"] },
      { id: "triggers", title: "Faster triggers", outcome: "Use Mars, Sun, Venus and Mercury as shorter activators; use the Moon only at suitable resolution.", activities: ["zoom controls", "next-contact stepper", "false precision critique"] },
      { id: "integration", title: "Timing synthesis", outcome: "Layer period, slow chapter and trigger with explicit limits.", activities: ["timing evidence stack", "ambiguous case", "prediction-safety assessment"] }
    ],
    completionEvidence: "Learner proposes a bounded time window, shows every layer, lists alternatives and states what cannot be forecast."
  }
];

export const curriculumById = Object.fromEntries(curriculumPaths.map((path) => [path.id, path]));
