import type { GrahaProfile, HouseProfile, NakshatraProfile, SignProfile } from "./types";

const traditional = { tradition: "classical-common", knowledgeType: "traditional-rule" } as const;

export const grahaProfiles: GrahaProfile[] = [
  { id: "sun", name: "Sun", sanskrit: "Sūrya", glyph: "☉", role: "identity, vitality and authority", naturalClass: "malefic", significations: ["purpose", "visibility", "father/authority", "vitality"], constructive: ["integrity", "leadership", "clarity"], strained: ["pride", "domination", "fragile recognition"], developmentalQuestion: "What deserves to organise my life?", owns: ["Leo"], exalted: "Aries", debilitated: "Libra", teachingHook: "Read the Sun as the centre that seeks coherent purpose, not simply ego.", source: traditional },
  { id: "moon", name: "Moon", sanskrit: "Candra", glyph: "☾", role: "mind, adaptation and felt safety", naturalClass: "conditional", significations: ["mind", "mother/care", "habit", "public responsiveness"], constructive: ["empathy", "adaptability", "nourishment"], strained: ["reactivity", "instability", "over-absorption"], developmentalQuestion: "What conditions help the mind feel held and responsive?", owns: ["Cancer"], exalted: "Taurus", debilitated: "Scorpio", teachingHook: "Always inspect phase, sign, house, lord and close contacts.", source: traditional },
  { id: "mars", name: "Mars", sanskrit: "Maṅgala", glyph: "♂", role: "action, separation and defence", naturalClass: "malefic", significations: ["initiative", "courage", "conflict", "technical force"], constructive: ["decisiveness", "protection", "precision"], strained: ["haste", "aggression", "burnout"], developmentalQuestion: "What is worth acting for, and how can force be proportionate?", owns: ["Aries", "Scorpio"], exalted: "Capricorn", debilitated: "Cancer", teachingHook: "Mars cuts: it can perform surgery, enforce boundaries or create conflict.", source: traditional },
  { id: "mercury", name: "Mercury", sanskrit: "Budha", glyph: "☿", role: "discrimination, exchange and language", naturalClass: "conditional", significations: ["speech", "reasoning", "trade", "skills"], constructive: ["curiosity", "adaptability", "articulation"], strained: ["nervous diffusion", "cunning", "over-analysis"], developmentalQuestion: "How do I test, translate and exchange information?", owns: ["Gemini", "Virgo"], exalted: "Virgo", debilitated: "Pisces", teachingHook: "Mercury takes colour from close company; examine association before judging.", source: traditional },
  { id: "jupiter", name: "Jupiter", sanskrit: "Guru/Bṛhaspati", glyph: "♃", role: "meaning, growth and counsel", naturalClass: "benefic", significations: ["wisdom", "children", "teachers", "expansion"], constructive: ["perspective", "generosity", "faith"], strained: ["excess", "dogma", "overconfidence"], developmentalQuestion: "What is worth trusting, teaching and enlarging?", owns: ["Sagittarius", "Pisces"], exalted: "Cancer", debilitated: "Capricorn", teachingHook: "Growth can enlarge problems too; inspect what Jupiter is expanding.", source: traditional },
  { id: "venus", name: "Venus", sanskrit: "Śukra", glyph: "♀", role: "value, attraction and agreement", naturalClass: "benefic", significations: ["relationship", "art", "pleasure", "resources"], constructive: ["reciprocity", "taste", "reconciliation"], strained: ["indulgence", "appeasement", "comparison"], developmentalQuestion: "What do I value enough to sustain through exchange?", owns: ["Taurus", "Libra"], exalted: "Pisces", debilitated: "Virgo", teachingHook: "Venus negotiates value; romance is only one expression.", source: traditional },
  { id: "saturn", name: "Saturn", sanskrit: "Śani", glyph: "♄", role: "time, limit and durable structure", naturalClass: "malefic", significations: ["work", "delay", "age", "responsibility"], constructive: ["discipline", "endurance", "realism"], strained: ["fear", "scarcity", "rigidity"], developmentalQuestion: "What must become reliable through time and practice?", owns: ["Capricorn", "Aquarius"], exalted: "Libra", debilitated: "Aries", teachingHook: "Saturn can delay, mature, formalise or concentrate; avoid reducing it to denial.", source: traditional },
  { id: "rahu", name: "Rahu", sanskrit: "Rāhu", glyph: "☊", role: "amplification, crossing and unfamiliar appetite", naturalClass: "malefic", significations: ["outsider experience", "ambition", "technology", "obsession"], constructive: ["innovation", "boundary-crossing", "strategic appetite"], strained: ["compulsion", "distortion", "insatiability"], developmentalQuestion: "Which unfamiliar experience attracts and destabilises me?", owns: [], exalted: "Tradition-dependent", debilitated: "Tradition-dependent", teachingHook: "Treat node rulership and dignity as selectable traditions, not universal facts.", source: { tradition: "tradition-dependent", knowledgeType: "traditional-rule", note: "Node dignities and aspects vary by lineage." } },
  { id: "ketu", name: "Ketu", sanskrit: "Ketu", glyph: "☋", role: "separation, inwardness and pattern completion", naturalClass: "malefic", significations: ["release", "past competence", "fragmentation", "insight"], constructive: ["discernment", "non-attachment", "specialisation"], strained: ["disconnection", "confusion", "withdrawal"], developmentalQuestion: "What is familiar enough to release, refine or see through?", owns: [], exalted: "Tradition-dependent", debilitated: "Tradition-dependent", teachingHook: "Ketu can sharpen or sever; infer its expression from ruler and contacts.", source: { tradition: "tradition-dependent", knowledgeType: "traditional-rule", note: "Node dignities and aspects vary by lineage." } }
];

const houseRows: Array<[string,string,string[],string[],string[],string[],string,number[]]> = [
  ["Tanu", "Self and embodiment", ["body", "appearance", "beginnings"], ["identity", "orientation"], ["self"], ["kendra", "dharma"], "How do I enter life and organise experience?", [5,9]],
  ["Dhana", "Resources and continuity", ["money", "speech", "food"], ["values", "security"], ["family"], ["panaphara", "artha", "maraka"], "What do I preserve, value and voice?", [6,10]],
  ["Sahaja", "Effort and communication", ["skills", "writing", "short travel"], ["courage", "curiosity"], ["siblings", "peers"], ["apoklima", "kama", "upachaya"], "What grows through repeated personal effort?", [7,11]],
  ["Sukha", "Home and inner ground", ["home", "land", "education"], ["belonging", "emotional foundation"], ["mother", "caregivers"], ["kendra", "moksha"], "What creates an inner and outer home?", [8,12]],
  ["Putra", "Creativity and discernment", ["children", "study", "performance"], ["authorship", "joy", "intelligence"], ["children", "students"], ["panaphara", "dharma", "trikona"], "What do I create, understand and pass forward?", [1,9]],
  ["Ari", "Work, friction and repair", ["service", "health routines", "debts"], ["problem-solving", "discipline"], ["workers", "competitors"], ["apoklima", "artha", "dusthana", "upachaya"], "What becomes manageable through skill and routine?", [2,10]],
  ["Yuvati", "Partnership and encounter", ["contracts", "marriage", "public dealings"], ["reciprocity", "projection"], ["partners", "clients"], ["kendra", "kama", "maraka"], "How do I meet an equal other?", [3,11]],
  ["Randhra", "Shared stakes and transformation", ["inheritance", "joint assets", "research"], ["vulnerability", "rupture", "depth"], ["in-laws", "heirs"], ["panaphara", "moksha", "dusthana"], "What changes when control must be shared or surrendered?", [4,12]],
  ["Dharma", "Worldview and guidance", ["higher study", "pilgrimage", "law"], ["meaning", "ethics", "faith"], ["teachers", "father/mentors"], ["apoklima", "dharma", "trikona"], "Which principles orient the long journey?", [1,5]],
  ["Karma", "Contribution and public action", ["profession", "status", "responsibility"], ["vocation", "accountability"], ["leaders", "employers"], ["kendra", "artha", "upachaya"], "What work can I stand behind publicly?", [2,6]],
  ["Lābha", "Gains and networks", ["income", "organisations", "audiences"], ["aspiration", "belonging to systems"], ["friends", "elder siblings"], ["panaphara", "kama", "upachaya"], "Which alliances and goals enlarge possibility?", [3,7]],
  ["Vyaya", "Release and beyond", ["expense", "retreat", "foreign residence"], ["solitude", "imagination", "surrender"], ["distant people", "institutions"], ["apoklima", "moksha", "dusthana"], "What requires rest, release or life beyond familiar boundaries?", [4,8]]
];

export const houseProfiles: HouseProfile[] = houseRows.map((h, i) => ({ number: i + 1, sanskrit: h[0], title: h[1], core: h[1], concrete: h[2], inner: h[3], people: h[4], classifications: h[5], developmentalQuestion: h[6], links: h[7], source: { tradition: "parashari", knowledgeType: "traditional-rule" } }));

const signRows: Array<[string,string,string,"fire"|"earth"|"air"|"water","movable"|"fixed"|"dual","active"|"receptive","sattva"|"rajas"|"tamas",string,string[],string[]]> = [
  ["aries","Meṣa","Mars","fire","movable","active","rajas","initiating through direct action",["courage","fresh starts"],["haste","combativeness"]],
  ["taurus","Vṛṣabha","Venus","earth","fixed","receptive","rajas","stabilising through value and form",["steadiness","craft"],["inertia","possessiveness"]],
  ["gemini","Mithuna","Mercury","air","dual","active","tamas","connecting through comparison and exchange",["versatility","dialogue"],["diffusion","inconsistency"]],
  ["cancer","Karka","Moon","water","movable","receptive","sattva","protecting through emotional attunement",["care","responsiveness"],["defensiveness","over-attachment"]],
  ["leo","Siṃha","Sun","fire","fixed","active","sattva","centering through creative authority",["confidence","generosity"],["pride","dramatisation"]],
  ["virgo","Kanyā","Mercury","earth","dual","receptive","tamas","refining through discrimination and service",["precision","repair"],["criticism","anxiety"]],
  ["libra","Tulā","Venus","air","movable","active","rajas","balancing through negotiation and proportion",["fairness","aesthetic judgment"],["indecision","appeasement"]],
  ["scorpio","Vṛścika","Mars","water","fixed","receptive","tamas","concentrating through depth and guarded force",["resilience","research"],["secrecy","control"]],
  ["sagittarius","Dhanu","Jupiter","fire","dual","active","sattva","orienting through principles and exploration",["vision","teaching"],["dogma","overreach"]],
  ["capricorn","Makara","Saturn","earth","movable","receptive","tamas","building through sequence and accountability",["discipline","strategy"],["severity","status anxiety"]],
  ["aquarius","Kumbha","Saturn","air","fixed","active","tamas","systematising through collective structures",["objectivity","social design"],["detachment","rigidity"]],
  ["pisces","Mīna","Jupiter","water","dual","receptive","sattva","dissolving boundaries through meaning and empathy",["imagination","compassion"],["confusion","escape"]]
];

export const signProfiles: SignProfile[] = signRows.map((s, i) => ({ id: s[0], number: i + 1, name: s[0][0].toUpperCase() + s[0].slice(1), sanskrit: s[1], ruler: s[2], element: s[3], modality: s[4], polarity: s[5], guna: s[6], style: s[7], constructive: s[8], distorted: s[9], teachingHook: `${s[2]} operating through ${s[3]} and ${s[4]} conditions: ${s[7]}.`, source: traditional }));

const nakshatraRows: Array<[string,string,string,string,string,"dharma"|"artha"|"kama"|"moksha",string]> = [
  ["Ashwini","Ketu","Aśvin twins","horse head","quick healing and initiation","dharma","Begin quickly; learn when speed serves repair."],
  ["Bharani","Venus","Yama","womb/vessel","bearing and removing","artha","Hold responsibility without turning containment into repression."],
  ["Krittika","Sun","Agni","razor/flame","burning and purifying","kama","Separate the essential from excess with proportion."],
  ["Rohini","Moon","Prajāpati","cart/temple","growth and creation","moksha","Cultivate form while noticing attachment to what flourishes."],
  ["Mrigashira","Mars","Soma","deer head","seeking and refreshing","moksha","Let curiosity search without endless displacement."],
  ["Ardra","Rahu","Rudra","teardrop/diamond","effort and transformation","kama","Use intensity to understand disruption rather than glorify it."],
  ["Punarvasu","Jupiter","Aditi","quiver/home","restoration and return","artha","Recover the essential after dispersal."],
  ["Pushya","Saturn","Bṛhaspati","udder/flower","nourishing and consecrating","dharma","Make care dependable through structure."],
  ["Ashlesha","Mercury","Nāgas","coiled serpent","binding and penetrating","dharma","Recognise the power and ethics of subtle influence."],
  ["Magha","Ketu","Pitṛs","throne","ancestral continuity","artha","Receive inheritance without becoming trapped by rank."],
  ["Purva Phalguni","Venus","Bhaga","hammock","enjoyment and renewal","kama","Let pleasure restore relationship and creativity."],
  ["Uttara Phalguni","Sun","Aryaman","bed legs","patronage and union","moksha","Turn affinity into reliable agreement."],
  ["Hasta","Moon","Savitṛ","hand","manifesting through skill","moksha","Bring intention into craft without over-controlling outcomes."],
  ["Chitra","Mars","Tvaṣṭṛ","bright jewel","beautiful construction","kama","Build striking form that serves more than appearance."],
  ["Swati","Rahu","Vāyu","young shoot","scattering and independence","artha","Develop flexibility without losing an orienting root."],
  ["Vishakha","Jupiter","Indra-Agni","triumphal arch","goal-directed achievement","dharma","Pursue aims while examining what victory means."],
  ["Anuradha","Saturn","Mitra","lotus/staff","devotion and alliance","dharma","Sustain friendship through discipline and shared purpose."],
  ["Jyeshtha","Mercury","Indra","earring/umbrella","seniority and protection","artha","Use strategic authority to protect rather than dominate."],
  ["Mula","Ketu","Nirṛti","root bundle","uprooting and investigation","kama","Go to the root while preserving what need not be destroyed."],
  ["Purva Ashadha","Venus","Āpas","fan/tusk","invigoration and declaration","moksha","Renew conviction while remaining open to correction."],
  ["Uttara Ashadha","Sun","Viśvedevas","elephant tusk","enduring victory","moksha","Align long effort with broadly defensible principles."],
  ["Shravana","Moon","Viṣṇu","ear/footprints","hearing and connection","artha","Learn by listening, tracing and transmitting carefully."],
  ["Dhanishtha","Mars","Vasus","drum/flute","abundance and rhythm","dharma","Coordinate resources through timing and participation."],
  ["Shatabhisha","Rahu","Varuṇa","empty circle","healing and enclosing","dharma","Investigate hidden systems without isolating completely."],
  ["Purva Bhadrapada","Jupiter","Aja Ekapāda","front funeral legs","intense idealism","artha","Convert intensity into ethical commitment."],
  ["Uttara Bhadrapada","Saturn","Ahirbudhnya","back funeral legs","stability in depth","kama","Hold profound feeling with patience and containment."],
  ["Revati","Mercury","Pūṣan","fish/drum","safe passage and nourishment","moksha","Guide transitions while knowing when a cycle is complete."]
];

const navamshaCycle = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const nakshatraSpans = ["0°00′–13°20′ Aries","13°20′–26°40′ Aries","26°40′ Aries–10°00′ Taurus","10°00′–23°20′ Taurus","23°20′ Taurus–6°40′ Gemini","6°40′–20°00′ Gemini","20°00′ Gemini–3°20′ Cancer","3°20′–16°40′ Cancer","16°40′–30°00′ Cancer","0°00′–13°20′ Leo","13°20′–26°40′ Leo","26°40′ Leo–10°00′ Virgo","10°00′–23°20′ Virgo","23°20′ Virgo–6°40′ Libra","6°40′–20°00′ Libra","20°00′ Libra–3°20′ Scorpio","3°20′–16°40′ Scorpio","16°40′–30°00′ Scorpio","0°00′–13°20′ Sagittarius","13°20′–26°40′ Sagittarius","26°40′ Sagittarius–10°00′ Capricorn","10°00′–23°20′ Capricorn","23°20′ Capricorn–6°40′ Aquarius","6°40′–20°00′ Aquarius","20°00′ Aquarius–3°20′ Pisces","3°20′–16°40′ Pisces","16°40′–30°00′ Pisces"];
const padaPrompts = ["initiate the motif", "stabilise the motif", "translate the motif through relationship", "integrate and hand off the motif"];

export const nakshatraProfiles: NakshatraProfile[] = nakshatraRows.map((n, i) => ({
  number: i + 1, id: n[0].toLowerCase().replaceAll(" ", "-"), name: n[0], span: nakshatraSpans[i], lord: n[1], deity: n[2], symbol: n[3], shakti: n[4], motivation: n[5], teachingHook: n[6],
  padas: ([1,2,3,4] as const).map((p, j) => ({ pada: p, navamsha: navamshaCycle[(i * 4 + j) % 12], hook: `Pada ${p}: ${padaPrompts[j]} through ${navamshaCycle[(i * 4 + j) % 12]} navāṃśa.` })),
  source: { tradition: "classical-common", knowledgeType: "traditional-rule", note: "Deity, symbol and śakti are traditional; psychological wording is pedagogical." }
}));

export const grahaById = Object.fromEntries(grahaProfiles.map((x) => [x.id, x]));
export const houseByNumber = Object.fromEntries(houseProfiles.map((x) => [x.number, x]));
export const signById = Object.fromEntries(signProfiles.map((x) => [x.id, x]));
export const nakshatraById = Object.fromEntries(nakshatraProfiles.map((x) => [x.id, x]));
