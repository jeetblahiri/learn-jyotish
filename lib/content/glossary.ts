import type { GlossaryEntry } from "./types";

const g = (term: string, transliteration: string, plainEnglish: string, category: string, related: string[] = [], devanagari?: string): GlossaryEntry => ({ term, transliteration, plainEnglish, category, related, devanagari });

export const glossary: GlossaryEntry[] = [
  g("Ayanamsha", "ayanāṃśa", "Angular offset used to relate a tropical reference frame to a sidereal zodiac.", "calculation", ["sidereal zodiac"]),
  g("Ascendant", "lagna", "The zodiac degree rising on the eastern horizon at the recorded time and place.", "calculation", ["house", "birth-time confidence"], "लग्न"),
  g("Graha", "graha", "A planetary agent in Jyotish; traditionally includes the Sun, Moon and lunar nodes.", "foundation", ["rashi", "bhava"], "ग्रह"),
  g("Rashi", "rāśi", "One of twelve equal 30-degree sidereal zodiac signs.", "foundation", ["sign lord", "zodiac"], "राशि"),
  g("Bhava", "bhāva", "A house or field of lived experience in the chart.", "foundation", ["house lord", "kendra"], "भाव"),
  g("Bhavesha", "bhāveśa", "The planet ruling the sign associated with a house; the house lord.", "lordship", ["dispositor"], "भावेश"),
  g("Drishti", "dṛṣṭi", "An aspect or directed influence; rules depend on the chosen Jyotish system.", "relationship", ["graha drishti", "rashi drishti"], "दृष्टि"),
  g("Graha drishti", "graha-dṛṣṭi", "Planetary aspect counted from the graha’s occupied house in a common Parashari model.", "relationship", ["drishti"]),
  g("Yuti", "yuti", "Joining or conjunction; software should distinguish sign/house sharing from close degree contact.", "relationship", ["orb", "combustion"], "युति"),
  g("Dispositor", "rāśi-adhipati", "The ruler of the sign occupied by a planet, showing a dependency in expression.", "lordship", ["final dispositor", "parivartana"]),
  g("Parivartana", "parivartana", "An exchange in which two planets occupy one another’s signs.", "lordship", ["dispositor"], "परिवर्तन"),
  g("Uchcha", "ucca", "Exaltation: a traditionally specified sign of heightened planetary capacity.", "condition", ["neecha", "dignity"], "उच्च"),
  g("Neecha", "nīca", "Debilitation: a traditionally specified sign of constrained or awkward planetary expression.", "condition", ["uchcha", "neecha-bhanga"], "नीच"),
  g("Moolatrikona", "mūlatrikoṇa", "A sign region associated with a planet’s characteristic functional strength.", "condition", ["own sign", "dignity"]),
  g("Neecha-bhanga", "nīca-bhaṅga", "Conditions traditionally said to modify or interrupt debilitation; not a blanket cancellation of difficulty.", "condition", ["neecha"]),
  g("Vakri", "vakrī", "Apparent retrograde motion as seen from Earth.", "calculation", ["station", "planetary speed"], "वक्री"),
  g("Asta", "asta", "Combustion or reduced visibility near the Sun, interpreted by planet-specific traditional criteria.", "condition", ["Sun", "angular separation"]),
  g("Kendra", "kendra", "Angular houses 1, 4, 7 and 10.", "house classification", ["trikona"], "केन्द्र"),
  g("Trikona", "trikoṇa", "Trinal houses, especially 1, 5 and 9, associated with dharma and support.", "house classification", ["kendra"], "त्रिकोण"),
  g("Dusthana", "duḥsthāna", "Houses 6, 8 and 12, associated with demanding processes, change, repair or release.", "house classification", ["upachaya"], "दुःस्थान"),
  g("Upachaya", "upacaya", "Growth houses 3, 6, 10 and 11, whose topics may develop through effort and time.", "house classification", ["dusthana"], "उपचय"),
  g("Maraka", "māraka", "A traditional ‘ending-producing’ function often associated with lords of houses 2 and 7; never use alone for death prediction.", "advanced", ["lordship", "prediction safety"]),
  g("Yogakaraka", "yogakāraka", "A planet whose lordship joins angular and trinal functions for a given ascendant.", "lordship", ["functional benefic"], "योगकारक"),
  g("Nakshatra", "nakṣatra", "One of 27 equal lunar mansions of 13°20′ used for fine zodiacal placement and timing.", "nakshatra", ["pada", "Vimshottari"], "नक्षत्र"),
  g("Pada", "pāda", "One quarter of a nakshatra, measuring 3°20′ and linking directly to a navamsha sign.", "nakshatra", ["nakshatra", "navamsha"], "पाद"),
  g("Varga", "varga", "A divisional chart derived from subdivisions of zodiac signs for a specified interpretive domain.", "division", ["navamsha", "vargottama"], "वर्ग"),
  g("Navamsha", "navāṃśa", "The ninth divisional chart (D9), used for dharma, maturation and relationship depth in common practice.", "division", ["varga", "pada"], "नवांश"),
  g("Vargottama", "vargottama", "A planet occupying the same sign in the natal sign chart and a selected divisional chart, especially D9.", "division", ["varga"], "वर्गोत्तम"),
  g("Yoga", "yoga", "A specified planetary or lordship combination; its expression depends on condition, repetition and timing.", "synthesis", ["cancellation", "dasha"], "योग"),
  g("Dasha", "daśā", "A symbolic planetary period system used to organise timing.", "timing", ["Vimshottari", "antardasha"], "दशा"),
  g("Vimshottari", "viṃśottarī", "A 120-year nakshatra-based planetary period sequence widely used in Parashari practice.", "timing", ["dasha", "Moon nakshatra"]),
  g("Antardasha", "antardaśā", "A subperiod nested within a major planetary period.", "timing", ["dasha"], "अन्तर्दशा"),
  g("Gochara", "gocara", "Planetary transit through the zodiac relative to the natal chart or another reference point.", "timing", ["natal promise", "station"], "गोचर"),
  g("Panchanga", "pañcāṅga", "Fivefold calendrical framework: lunar day, weekday, nakshatra, yoga and karana.", "timing", ["muhurta"], "पञ्चाङ्ग"),
  g("Arudha", "ārūḍha", "A Jaimini-derived projected reference used for manifested image or perception; keep separate from house substance.", "advanced", ["Jaimini"], "आरूढ"),
  g("Shadbala", "ṣaḍbala", "A sixfold quantitative strength framework; its components answer distinct questions and need not imply benefic outcomes.", "advanced", ["strength", "condition"], "षड्बल"),
  g("Ashtakavarga", "aṣṭakavarga", "A bindu-based system for evaluating sign support, often applied to transit assessment.", "advanced", ["transit"], "अष्टकवर्ग"),
  g("Desha-kala-patra", "deśa-kāla-pātra", "Place, time and person: the contextual principle that symbols must be interpreted for actual circumstances.", "ethics", ["prediction safety"], "देश-काल-पात्र")
];

export const glossaryByTerm = Object.fromEntries(glossary.map((entry) => [entry.term.toLowerCase(), entry]));
