import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [
  {
    id: "case-craft-or-inhibition", title: "Craft or inhibition?", level: "foundation", context: "An adult works in a creative profession but reports slow confidence and strong technical discipline.", birthTimeConfidence: "high",
    placements: ["Saturn in House 5", "Fifth lord strong in House 10", "Venus supports the fifth lord"],
    tensions: ["Saturn can constrain spontaneity", "Strong fifth lord and Venus support sustained creative output"],
    prompts: ["List three fifth-house topics before discussing children.", "Which factor modifies Saturn?", "Offer two plausible expressions."],
    evidence: [{ direction: "supports", statement: "Saturn supports repetition, discipline and long-form craft." }, { direction: "modifies", statement: "A strong fifth lord gives the field capacity and public outlet." }, { direction: "contradicts", statement: "A blanket claim of creative denial conflicts with the person’s sustained output." }],
    modelSynthesis: "Creativity may feel effortful or late-blooming, yet structure can become the mechanism of mastery. Confidence and spontaneity may develop more slowly than technical skill.", timingCaution: "Do not infer fertility outcomes from this cluster; that would require a separate, careful and ethically limited analysis."
  },
  {
    id: "case-strong-difficult-lord", title: "Powerful but mixed agenda", level: "intermediate", context: "A manager is highly effective under pressure but repeatedly enters demanding institutional conflicts.", birthTimeConfidence: "high",
    placements: ["Mars exalted in House 10", "Mars rules Houses 6 and 11", "Saturn aspects House 10"],
    tensions: ["Exaltation gives Mars capacity", "Sixth-house ownership and Saturn add conflict, work and consequence"],
    prompts: ["Separate strength from agenda.", "What could be constructive and strained expressions?", "What evidence would distinguish leadership from chronic conflict?"],
    evidence: [{ direction: "supports", statement: "Exalted Mars can organise decisive public action." }, { direction: "modifies", statement: "Sixth-house rulership channels action through problems, competition and service." }, { direction: "contradicts", statement: "Exaltation does not support the claim that career must be easy or universally admired." }],
    modelSynthesis: "The chart supports high operational capacity, especially in contested or technical environments. Durable success may depend on proportionate force, delegation and conflict boundaries.", timingCaution: "Career events require active Mars/lordship periods and relevant transits; avoid promising promotion or litigation outcomes."
  },
  {
    id: "case-empty-seventh", title: "The empty partnership house", level: "foundation", context: "A learner assumes an empty seventh house means partnership is absent.", birthTimeConfidence: "medium",
    placements: ["No planet in House 7", "Seventh lord in House 9", "Jupiter aspects House 7", "Birth time could shift Lagna near a boundary"],
    tensions: ["The house is empty", "Lordship and aspect remain active", "Time uncertainty could change the whole-sign house frame"],
    prompts: ["Trace the seventh lord.", "Explain the incoming aspect.", "State what cannot be concluded."],
    evidence: [{ direction: "supports", statement: "The seventh lord links partnership with study, travel or worldview." }, { direction: "modifies", statement: "Jupiter adds counsel, ideals or expansion to the field." }, { direction: "contradicts", statement: "Birth-time uncertainty weakens house-specific confidence." }],
    modelSynthesis: "Partnership themes may connect with learning, distance or shared principles, but the house frame should be confirmed before detailed claims.", timingCaution: "No marriage date or relationship outcome follows from emptiness, lordship or one aspect."
  },
  {
    id: "case-ambiguous-mercury", title: "The adaptable mind", level: "intermediate", context: "The person alternates between lucid analysis and anxious over-processing, especially under social pressure.", birthTimeConfidence: "high",
    placements: ["Mercury in own sign", "Mercury closely conjunct Rahu", "Moon receives Saturn’s aspect"],
    tensions: ["Mercury has sign capacity", "Rahu amplifies and distorts", "Moon-Saturn adds emotional caution"],
    prompts: ["Why is ‘strong Mercury’ incomplete?", "Separate cognitive skill from emotional ease.", "Construct two hypotheses."],
    evidence: [{ direction: "supports", statement: "Own-sign Mercury supports analytical and linguistic capacity." }, { direction: "modifies", statement: "Rahu may intensify curiosity, novelty and cognitive appetite." }, { direction: "contradicts", statement: "Moon-Saturn suggests that skill does not guarantee subjective ease." }],
    modelSynthesis: "High informational capacity may coexist with overstimulation. Structure, source-checking and emotional pacing could determine whether amplification becomes innovation or anxiety.", timingCaution: "Do not diagnose anxiety disorders from the chart; clinical concerns belong with qualified professionals."
  },
  {
    id: "case-natal-versus-transit", title: "A transit without a verdict", level: "intermediate", context: "Transit Saturn enters House 7 while the person is deciding whether to formalise a business partnership.", birthTimeConfidence: "high",
    placements: ["Natal seventh lord in House 11", "Saturn transits House 7", "Jupiter simultaneously aspects the seventh lord", "Relevant dasha information is not yet supplied"],
    tensions: ["Saturn emphasises structure and consequence", "Jupiter supports growth or counsel", "No active-period layer is available"],
    prompts: ["Describe the chapter without naming an event.", "List missing timing data.", "Offer constructive and difficult manifestations."],
    evidence: [{ direction: "supports", statement: "Saturn makes contracts, boundaries and obligations salient." }, { direction: "modifies", statement: "Jupiter may support counsel, opportunity or broader participation." }, { direction: "contradicts", statement: "Without dasha and exact passes, event-level timing is weak." }],
    modelSynthesis: "This is a plausible period for making partnership structures explicit—through commitment, renegotiation or pruning. The chart does not choose the outcome for the person.", timingCaution: "Show ingress, station and repeated passes; require legal advice for consequential contracts."
  },
  {
    id: "case-varga-conflict", title: "D1 promise, D10 complication", level: "advanced", context: "The natal chart strongly emphasises public work, while D10 shows a weakened career lord and repeated changes in professional direction.", birthTimeConfidence: "medium",
    placements: ["D1 tenth lord strong and angular", "D10 tenth lord constrained", "Mercury periods coincide with role changes"],
    tensions: ["D1 supports visible contribution", "D10 complicates continuity and role fit", "Medium birth-time confidence affects D10 house placement"],
    prompts: ["Do not choose one chart and discard the other.", "What changes if birth time moves five minutes?", "State a synthesis with two expressions."],
    evidence: [{ direction: "supports", statement: "D1 repeats a strong need for public contribution." }, { direction: "modifies", statement: "D10 suggests that professional containers may be unstable or require refinement." }, { direction: "contradicts", statement: "Birth-time sensitivity reduces confidence in precise D10-house claims." }],
    modelSynthesis: "Public contribution appears important, but the form of work may require repeated redesign. A strong vocational drive can coexist with unstable titles, institutions or methods.", timingCaution: "Use only varga factors stable across the plausible birth-time range; do not rectify birth time merely to fit career history."
  }
];
