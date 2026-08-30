# Drishti — Interactive Jyotish Learning Laboratory

Drishti is an interactive web application for learning interpretive Vedic astrology through a small, explicit set of generative principles. It keeps astronomical calculations, inherited Jyotish rules, and interpretive hypotheses visibly separate so that learners can inspect how a conclusion was produced instead of memorising isolated statements.

## What you can explore

- Generate a natal chart from date, time, birthplace, coordinates, and historical IANA timezone data.
- Work with canonical North Indian D1, D9, D10, and Chandra Lagna chart views.
- Select planets, houses, signs, nakshatras, padas, lordships, dignities, dispositors, aspects, functional roles, and yoga candidates.
- Compare natal promise with Vimshottari mahadasha/antardasha periods and up to 30 years of transits.
- Rotate an interactive geocentric learning sphere with zodiac, ecliptic, equator, horizon, and nakshatra layers.
- Build interpretations from supporting, modifying, and counter-evidence with visible rule provenance.
- Follow a 12-module foundation course, structured learning paths, worked examples, ambiguous cases, and practice exercises.
- Save charts, learning progress, and a reasoning notebook locally in the browser.
- Export and import the private workspace as JSON or print a learning report.

## Learning model

Drishti labels knowledge by type:

1. **Astronomical fact** — a calculated position, separation, speed, or time interval.
2. **Traditional rule** — an inherited Jyotish mapping such as lordship, dignity, or graha drishti.
3. **Interpretive hypothesis** — a contextual reading that should be tested against supporting and contradictory evidence.

The application is educational and intentionally non-deterministic. It does not present astrological interpretation as scientific fact or as a replacement for medical, legal, financial, or mental-health advice.

## Run locally

Requirements: Node.js `>=22.13.0` and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm test
```

`npm test` creates a production build and runs domain and rendered-accessibility tests.

## Project structure

```text
app/                     Application entry point and global design tokens
components/app/          Learning workspace, navigation, place search, notebook
components/jyotish/      North Indian chart, evidence trail, geocentric sky
lib/content/             Curriculum, profiles, cases, glossary, exercises, safety
lib/jyotish/             Calculation, varga, rule, yoga, timing, transit, synthesis
lib/places.ts            Searchable place catalogue and timezone conversion
lib/workspace-storage.ts Local browser persistence and portable exports
tests/                   Domain and server-rendered interface tests
```

## Calculation scope and limitations

The current engine is designed for transparent learning. It uses Astronomy Engine for planetary astronomy and exposes the sidereal conversion and interpretation pipeline in `lib/jyotish`.

- Lahiri, Raman, and KP ayanamsha choices are implemented as documented learning-grade approximations.
- Mean nodes are supported; selecting true nodes produces an explicit fallback warning.
- The place catalogue is extensive but offline, with custom coordinates and IANA timezones available for locations not listed.
- Production use requiring Swiss Ephemeris parity should add a verified ephemeris service and regression fixtures before making precision claims.

See [`lib/jyotish/README.md`](lib/jyotish/README.md) for the calculation contract and approximation boundaries.

## Privacy

Birth data, saved charts, lesson progress, and notebook entries remain in browser `localStorage`. The application does not transmit them to an application database. Clearing browser site data removes the workspace unless it has been exported first.

## Technology

- React 19 and Next-compatible Vinext runtime
- TypeScript
- Astronomy Engine
- CSS Modules
- Cloudflare-compatible Sites build

## Responsible interpretation

Use Drishti to learn how Jyotish reasoning is assembled, compare alternative expressions, and document uncertainty. Avoid fatalistic claims, guaranteed predictions, fear-based language, and decisions that remove a person's agency.
