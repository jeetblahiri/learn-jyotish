# Drishti Jyotish domain engine

This package separates calculated positions, traditional teaching rules, and interpretive hypotheses. Its public API is exported from `index.ts`.

## Calculation

- `calculateChart({ date, latitude, longitude, settings, fixedAscendantSign })`
- `utcFromZonedParts(parts, ianaTimeZone)`
- `ayanamshaDegrees(date, mode)` and `AYANAMSHA_METADATA`
- Settings support Lahiri by default plus explicitly approximate Raman/KP comparisons, mean nodes, and an explicit true-node fallback warning.
- Each position includes sidereal longitude, sign, whole-sign house, degrees, daily speed, retrograde state, nakshatra/pada, and D1/D9/D10 signs.

The ayanamsha models and node longitude are learning-grade approximations. Consumers must display `chart.warnings`; they should not silently present these values as consultation-grade ephemeris output.

## Transparent rules

- `lordOfSign`, `lordOfHouse`, `housesRuled`, `functionalRole`
- `dignityOf`, `aspectsFrom`, `aspectsHouse`, `conjunctions`
- `dispositorChain`, `detectYogaCandidates`

Node aspects/dignities and yoga detections are deliberately labelled as tradition-dependent candidates where appropriate.

## Timing and synthesis

- `vimshottariTimeline`, `activeDashaAt`
- `transitContacts`, `contactsForNatalHouse`
- `synthesizeChart`, `chartFunctionalRoles`

Synthesis returns supporting, modifying, and counter-evidence with provenance. It uses qualitative evidence labels, never fabricated probabilities, and always returns interpretive limits.
