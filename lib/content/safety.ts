export const predictionSafety = {
  purpose: "Support reflective learning while preventing symbolic language from being mistaken for scientific diagnosis, guaranteed forecasting or professional advice.",
  language: {
    prefer: ["may", "can express as", "one plausible theme", "if repeated elsewhere", "test against context", "confidence is limited because"],
    avoid: ["will definitely", "the chart proves", "you are destined", "this placement causes", "nothing can change this"]
  },
  highStakesDomains: [
    { domain: "health and mental health", rule: "Do not diagnose, name disease, predict death or discourage clinical care. Describe only broad reflective themes and recommend qualified care where relevant." },
    { domain: "pregnancy and children", rule: "Do not predict conception, infertility, fetal outcome or a child’s health. Never reduce House 5 to fertility." },
    { domain: "money", rule: "Do not promise returns, losses, employment or business success. Encourage regulated financial guidance for decisions." },
    { domain: "law", rule: "Do not predict verdicts, imprisonment or dispute outcomes. Encourage qualified legal advice." },
    { domain: "relationships", rule: "Do not declare marriage, divorce, infidelity or abuse from chart symbolism. Prioritise consent and real-world evidence." },
    { domain: "safety", rule: "If a user describes immediate danger or self-harm, stop astrological interpretation and direct them to local emergency or crisis support." }
  ],
  interpretationChecklist: [
    "Label calculated facts, traditional rules and hypotheses separately.",
    "Show the selected tradition and calculation settings.",
    "State birth-time confidence and sensitivity.",
    "Require at least two independent supporting structures for a strong thematic claim.",
    "Display modifying and contradicting evidence.",
    "Offer at least two plausible expressions when context is missing.",
    "Name what cannot be inferred.",
    "For timing, combine natal structure, active period and transit without promising an event.",
    "Invite observation and revision rather than compliance."
  ],
  uiNotices: {
    chart: "This chart is a symbolic learning model. Verify calculation settings and birth-time reliability before interpreting houses or divisions.",
    synthesis: "Interpretations are conditional hypotheses assembled from the visible rules—not facts about personality or guaranteed outcomes.",
    timing: "Timing layers identify periods of symbolic emphasis. They do not predict a specific event or replace professional judgment.",
    highStakes: "This topic requires real-world evidence and, where appropriate, a qualified health, legal, financial or safety professional."
  }
} as const;

export const confidenceLabels = [
  { id: "exploratory", label: "Exploratory", criteria: "One relevant factor or material uncertainty; use only to generate questions." },
  { id: "moderate", label: "Moderate", criteria: "Two or more independent supports with visible modifications; still context-dependent." },
  { id: "strong-theme", label: "Strong theme", criteria: "Repeated independent structure with stable calculation inputs and limited contradiction; never an event probability." }
] as const;
