import type { FoundationModule } from "./types";

const choices = (correct: string, ...distractors: string[]) => [correct, ...distractors];

export const foundationModules: FoundationModule[] = [
  {
    id: "chart-model", order: 1, title: "What a chart represents",
    objective: "Distinguish calculated sky positions from the symbolic framework used to interpret them.",
    explanation: "A natal chart freezes a time and place, converts planetary positions to a chosen sidereal zodiac, and maps them into houses. The positions are calculations; Jyotish meanings are inherited interpretive rules and hypotheses.",
    principles: ["Time and place determine the calculated frame.", "The zodiac setting changes sign positions.", "A symbol is not an event prediction."],
    interactivePrompt: "Toggle tropical/sidereal and move birth time by ten minutes. Notice what changes and what remains stable.",
    workedExample: { setup: "The Moon stays in Taurus while Lagna changes from late Gemini to Cancer.", reasoning: ["The Moon theme is stable.", "House placement and lordship change.", "House-based claims require time confidence."], synthesis: "Retain lunar observations; qualify ascendant-dependent ones." },
    commonMistake: "Treating the rendered chart as an objective verdict rather than a model with settings and uncertainty.",
    masteryQuestion: { prompt: "Which statement is an astronomical fact?", choices: choices("Mars is at 14° sidereal Leo.", "Mars guarantees conflict.", "Mars in Leo seeks recognition."), answer: 0, feedback: "A coordinate is calculated; meanings and predictions are interpretive layers." },
    summary: "Calculate first, name the tradition second, interpret conditionally third.",
    source: { tradition: "astronomical", knowledgeType: "astronomical-fact" }
  },
  {
    id: "signs", order: 2, title: "Signs as environments",
    objective: "Use element, modality and ruler to derive a sign’s behavioural style.",
    explanation: "A rāśi describes the environment and manner through which a graha operates. It modifies the actor; it does not replace the actor’s function.",
    principles: ["Element suggests the medium.", "Modality suggests pace and response.", "The ruler links the placement to another chart location."],
    interactivePrompt: "Keep one planet selected and move it through movable, fixed and dual signs; compare what changes in the generated sentence.",
    workedExample: { setup: "Mercury in fixed-earth Taurus.", reasoning: ["Mercury processes and exchanges information.", "Earth favours tangible evidence.", "Fixed modality sustains and consolidates."], synthesis: "Communication may become measured, practical and persistent." },
    commonMistake: "Importing the natural-house analogy, such as equating Aries with the first house, into every chart.",
    masteryQuestion: { prompt: "What does a sign primarily modify?", choices: choices("How a planet expresses its function.", "Which life field is activated.", "Whether an event must occur."), answer: 0, feedback: "The house supplies the field; the sign supplies style and conditions." },
    summary: "Read sign as style: element + modality + ruler, never as destiny.",
    source: { tradition: "classical-common", knowledgeType: "traditional-rule" }
  },
  {
    id: "houses", order: 3, title: "Houses as life fields",
    objective: "Identify a house as a field of experience and distinguish occupancy from ownership.",
    explanation: "Bhāvas organise experience: identity, resources, relationships, work and other domains. A house is read through its sign, lord, occupants and incoming influences.",
    principles: ["Occupant shows an active agent in the field.", "Lord carries the field elsewhere.", "Empty does not mean inactive."],
    interactivePrompt: "Select an empty house, trace its lord, then compare it with an occupied house.",
    workedExample: { setup: "The tenth house is empty; its lord is in the eleventh.", reasoning: ["No occupant does not erase work themes.", "The tenth lord carries work matters to networks and gains.", "Its condition modifies ease and expression."], synthesis: "Contribution may develop through organisations, audiences or collaborative goals." },
    commonMistake: "Reading only planets inside a house and ignoring the house lord.",
    masteryQuestion: { prompt: "An empty seventh house means…", choices: choices("Read its sign, lord and aspects.", "No relationships.", "Relationships are unimportant."), answer: 0, feedback: "Every house remains part of the chart." },
    summary: "For every house ask: sign, lord, occupants, aspects, repetition.",
    source: { tradition: "parashari", knowledgeType: "traditional-rule" }
  },
  {
    id: "grahas", order: 4, title: "Grahas as functions",
    objective: "Describe each graha as a function with constructive and strained expressions.",
    explanation: "Grahas are the active agents of the chart. Their natural significations remain recognisable, while sign, house, rulership and relationships alter how they can operate.",
    principles: ["Natural benefic/malefic is not moral judgment.", "Condition changes expression.", "Nodes amplify and redirect rather than rule signs uniformly across traditions."],
    interactivePrompt: "Choose one house and cycle every graha through it. Name what stays constant and what changes.",
    workedExample: { setup: "Saturn in the fifth house.", reasoning: ["Saturn structures through limits and repetition.", "The fifth concerns creativity, learning and authorship.", "Dignity and aspects decide whether restraint becomes craft or inhibition."], synthesis: "Creative confidence may mature through sustained practice rather than spontaneity alone." },
    commonMistake: "Labelling a graha wholly good or bad before reading its functional role and condition.",
    masteryQuestion: { prompt: "Which is the soundest first statement?", choices: choices("Saturn concentrates effort and consequence.", "Saturn always denies.", "Saturn always rewards."), answer: 0, feedback: "Begin with function; derive expression from context." },
    summary: "Planet = function; condition and context determine its range of expression.",
    source: { tradition: "classical-common", knowledgeType: "traditional-rule" }
  },
  {
    id: "lordship", order: 5, title: "House lordship",
    objective: "Trace how a house lord connects two life fields.",
    explanation: "The sign on a house identifies its lord. The lord’s destination, condition and associations show where and how that house’s topics seek expression.",
    principles: ["House A’s lord in House B links A to B.", "One planet can carry two houses.", "Functional role depends on the ascendant."],
    interactivePrompt: "Click any house, follow its ruler to another house, then reverse the sentence to test whether it still makes sense.",
    workedExample: { setup: "The second lord occupies the ninth.", reasoning: ["The second concerns resources, speech and family continuity.", "The ninth concerns study, guidance and worldview.", "The lord links these domains; dignity sets capacity."], synthesis: "Resources or speech may develop through education, teaching, travel or inherited belief systems." },
    commonMistake: "Predicting wealth from a single lord placement without assessing the lord or related houses.",
    masteryQuestion: { prompt: "Lordship primarily creates…", choices: choices("A relationship between two house fields.", "A guaranteed event.", "A new zodiac sign."), answer: 0, feedback: "It is a structural link that still requires condition and timing." },
    summary: "Trace each important topic through its lord before judging it.",
    source: { tradition: "parashari", knowledgeType: "traditional-rule" }
  },
  {
    id: "condition", order: 6, title: "Dignity and condition",
    objective: "Separate types of planetary strength and avoid collapsing them into a score.",
    explanation: "Sign dignity, combustion, retrogression, phase, relationships and house context answer different questions. Strength can increase a planet’s ability to act without making every result pleasant.",
    principles: ["Exaltation is capacity, not perfection.", "Debilitation is constraint, not doom.", "Dispositor condition can support or limit a placement."],
    interactivePrompt: "Compare the same planet in exaltation, own sign and debilitation; reveal the dispositor for each.",
    workedExample: { setup: "Exalted Mars rules difficult houses and receives Saturn’s influence.", reasoning: ["Mars has strong sign capacity.", "Its functional agenda is mixed.", "Saturn modifies pace and pressure."], synthesis: "Decisive action may be powerful but carry demanding obligations; strength is not identical to ease." },
    commonMistake: "Adding every strength factor into an unexplained percentage.",
    masteryQuestion: { prompt: "An exalted planet is…", choices: choices("Capable, but still contextual.", "Always beneficial.", "Unaffected by lordship."), answer: 0, feedback: "Capacity, agenda and outcome must be read separately." },
    summary: "Ask strength for what, operating where, and serving which houses.",
    source: { tradition: "parashari", knowledgeType: "traditional-rule" }
  },
  {
    id: "dispositors", order: 7, title: "Dispositor chains",
    objective: "Follow dependencies from a planet to its sign lord and final dispositor.",
    explanation: "A planet depends on the ruler of the sign it occupies. Repeated chains reveal resource hubs, mutual exchanges and bottlenecks in the chart.",
    principles: ["Planet → sign lord creates a dependency.", "A final dispositor concentrates coordination.", "Mutual reception forms a closed exchange."],
    interactivePrompt: "Turn on the dispositor graph and follow the selected planet until the chain repeats or ends.",
    workedExample: { setup: "Moon in Virgo → Mercury in Taurus → Venus in Pisces → Jupiter in Sagittarius.", reasoning: ["Each expression depends on the next ruler.", "Jupiter is in its own sign.", "The chain converges on Jupiter."], synthesis: "Meaning-making and guidance may organise several otherwise different functions." },
    commonMistake: "Calling the final dispositor all-powerful without checking its house, aspects and actual condition.",
    masteryQuestion: { prompt: "A dispositor tells us…", choices: choices("Which planet hosts another planet’s sign expression.", "Which event happens next.", "Only the strongest planet."), answer: 0, feedback: "It reveals dependency, not automatic dominance." },
    summary: "Follow the chain; then inspect the condition of every important link.",
    source: { tradition: "classical-common", knowledgeType: "traditional-rule" }
  },
  {
    id: "conjunctions", order: 8, title: "Co-tenancy and conjunction",
    objective: "Distinguish same-house grouping from close longitudinal contact.",
    explanation: "Planets may share a house or sign without being equally close. Co-tenancy links agendas broadly; close degree contact intensifies direct interaction.",
    principles: ["Show angular separation.", "Combustion and planetary war have specific criteria.", "Multi-planet groups require pairwise inspection."],
    interactivePrompt: "Drag two planets within one sign and watch the relationship label change from co-tenant to close conjunction.",
    workedExample: { setup: "Venus at 2° and Saturn at 27° in the same sign.", reasoning: ["They share a sign and house.", "Their 25° separation is not a tight conjunction.", "Both still contribute to the same life field."], synthesis: "Relational and duty themes coexist, but should not be fused as strongly as a close contact." },
    commonMistake: "Calling every same-house pair an equally strong conjunction.",
    masteryQuestion: { prompt: "What must be displayed before judging conjunction intensity?", choices: choices("Longitudinal separation.", "House number alone.", "Planet colour."), answer: 0, feedback: "Degree distance clarifies whether interaction is broad or close." },
    summary: "Group by house, relate by sign, measure by degree.",
    source: { tradition: "modern-pedagogy", knowledgeType: "interpretive-hypothesis" }
  },
  {
    id: "aspects", order: 9, title: "Graha dṛṣṭi",
    objective: "Count house-based aspects and identify sender, receiver and tradition setting.",
    explanation: "In a common Parāśari model, every graha aspects the seventh from itself; Mars, Jupiter and Saturn have additional full aspects. Node rules vary and must be labelled.",
    principles: ["Count the occupied house as one.", "Separate conjunction from aspect.", "An aspect modifies; it does not erase the receiver."],
    interactivePrompt: "Select Mars, Jupiter or Saturn and animate every counted house to each aspect target.",
    workedExample: { setup: "Jupiter in House 2.", reasoning: ["Its fifth aspect reaches House 6.", "Its seventh reaches House 8.", "Its ninth reaches House 10."], synthesis: "Jupiter connects resources with service, shared resources and contribution; each receiving field still needs its own lord analysis." },
    commonMistake: "Mixing sign aspects, degree aspects and graha aspects without naming the system.",
    masteryQuestion: { prompt: "Saturn’s special full aspects are…", choices: choices("3rd and 10th, plus 7th.", "4th and 8th, plus 7th.", "5th and 9th, plus 7th."), answer: 0, feedback: "Mars: 4/8; Jupiter: 5/9; Saturn: 3/10, with the common 7th." },
    summary: "Name the aspect system, count visibly, then inspect the receiving house.",
    source: { tradition: "parashari", knowledgeType: "traditional-rule" }
  },
  {
    id: "repetition", order: 10, title: "Whole-chart repetition",
    objective: "Rank repeated themes above isolated symbolic matches.",
    explanation: "Synthesis becomes more reliable when independent structures repeat a theme: house, lord, significator, dispositor and divisional confirmation. Contradictions should remain visible.",
    principles: ["One factor suggests; repetition strengthens.", "Independent evidence matters more than duplicated wording.", "Counter-evidence modifies confidence."],
    interactivePrompt: "Choose a life topic and let the evidence board group supporting, modifying and contradicting factors.",
    workedExample: { setup: "Communication appears through the third house, Mercury, and the tenth lord.", reasoning: ["Three structures repeat expression and exchange.", "One difficult aspect adds pressure.", "The theme is strong but its tone is mixed."], synthesis: "Communication is a credible vocational theme, developed through disciplined rather than effortless expression." },
    commonMistake: "Counting several consequences of one placement as independent confirmation.",
    masteryQuestion: { prompt: "Which claim deserves greater confidence?", choices: choices("A theme repeated by lordship, significator and varga.", "A theme from one generic keyword.", "A theme that sounds personally flattering."), answer: 0, feedback: "Structural repetition is stronger than rhetorical plausibility." },
    summary: "Compile evidence, preserve contradiction, and state confidence qualitatively.",
    source: { tradition: "modern-pedagogy", knowledgeType: "interpretive-hypothesis" }
  },
  {
    id: "natal-transit", order: 11, title: "Natal promise and transit activation",
    objective: "Separate enduring natal structure from temporary transit conditions.",
    explanation: "The natal chart describes recurring potentials. Transits describe moving conditions that may activate them; a transit alone is not sufficient evidence for a specific event.",
    principles: ["Read natal structure first.", "Slow transits describe chapters; fast planets trigger shorter windows.", "Repeated passes matter."],
    interactivePrompt: "Overlay a transit, then hide it and identify which natal factors existed before the transit arrived.",
    workedExample: { setup: "Transit Saturn crosses the natal seventh house.", reasoning: ["Partnership structure becomes salient.", "The natal seventh lord shows what can be activated.", "Daśā and repeated contacts refine timing."], synthesis: "A period of relational responsibility or renegotiation is plausible; marriage or separation cannot be inferred from this alone." },
    commonMistake: "Predicting an external event solely from a planet entering a house.",
    masteryQuestion: { prompt: "A transit primarily shows…", choices: choices("A temporary activation context.", "A guaranteed event.", "A replacement natal chart."), answer: 0, feedback: "Natal structure remains the foundation." },
    summary: "Natal potential + active period + transit repetition = a timing hypothesis, not certainty.",
    source: { tradition: "parashari", knowledgeType: "interpretive-hypothesis" }
  },
  {
    id: "responsible-synthesis", order: 12, title: "Responsible synthesis",
    objective: "Produce a useful, bounded interpretation with evidence, alternatives and uncertainty.",
    explanation: "A complete reading states the claim, supporting and counter-evidence, plausible expressions, missing information and timing conditions. It avoids deterministic or fear-based claims.",
    principles: ["Use conditional language.", "Consider age, culture and life context.", "Never infer high-stakes outcomes from symbolism alone."],
    interactivePrompt: "Build a claim from draggable evidence cards, then add one contradiction and one alternative expression before submitting.",
    workedExample: { setup: "Strong work-house activation with mixed Moon factors.", reasoning: ["Contribution is repeatedly emphasised.", "Emotional sustainability is less clear.", "Context determines whether this becomes leadership, service or overwork."], synthesis: "Work may become a major organising arena, with deliberate rest and emotional boundaries improving sustainability." },
    commonMistake: "Turning a coherent symbolic story into a diagnosis or certain forecast.",
    masteryQuestion: { prompt: "Which ending is responsible?", choices: choices("This is one plausible expression; test it against context and timing.", "This will definitely happen.", "The chart cannot be wrong."), answer: 0, feedback: "Interpretation remains a transparent, revisable hypothesis." },
    summary: "Be specific about reasoning and modest about certainty.",
    source: { tradition: "modern-pedagogy", knowledgeType: "interpretive-hypothesis" }
  }
];
