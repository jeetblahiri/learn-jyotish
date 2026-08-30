import { ASPECT_COUNTS } from "./constants";
import { signedAngularDelta } from "./astronomy";
import type { JyotishChart, PlanetName, PlanetPosition, RuleProvenance } from "./types";

export interface TransitContact {
  transitPlanet: PlanetName; natalPlanet?: PlanetName; natalHouse: number; kind: "conjunction" | "opposition" | "graha-aspect" | "house-occupancy";
  separation?: number; applying?: boolean; exactness: "exact-degree" | "within-orb" | "whole-sign";
  provenance: RuleProvenance; interpretationLimit: string;
}

function futureSeparation(transit: PlanetPosition, natalLongitude: number, aspectAngle: number): number {
  return Math.abs(signedAngularDelta(transit.longitude + transit.speed / 24, natalLongitude + aspectAngle));
}

export function transitContacts(natal: JyotishChart, transit: JyotishChart, orb = 3): TransitContact[] {
  const contacts: TransitContact[] = [];
  for (const moving of transit.positions) {
    contacts.push({ transitPlanet: moving.name, natalHouse: moving.house, kind: "house-occupancy", exactness: "whole-sign", provenance: { kind: "astronomical", tradition: "Sidereal whole-sign overlay", rule: `Transit occupies natal H${moving.house}` }, interpretationLimit: "Occupancy identifies an activated field, not a guaranteed event." });
    for (const natalPlanet of natal.positions) {
      const conjunctionDistance = Math.abs(signedAngularDelta(moving.longitude, natalPlanet.longitude));
      const oppositionDistance = Math.abs(Math.abs(signedAngularDelta(moving.longitude, natalPlanet.longitude)) - 180);
      if (conjunctionDistance <= orb) contacts.push({ transitPlanet: moving.name, natalPlanet: natalPlanet.name, natalHouse: natalPlanet.house, kind: "conjunction", separation: conjunctionDistance, applying: futureSeparation(moving, natalPlanet.longitude, 0) < conjunctionDistance, exactness: conjunctionDistance < 0.25 ? "exact-degree" : "within-orb", provenance: { kind: "astronomical", tradition: "Degree contact", rule: `${moving.name} within ${orb}° of natal ${natalPlanet.name}` }, interpretationLimit: "A close transit contact needs natal promise, period activation and life context." });
      if (oppositionDistance <= orb) contacts.push({ transitPlanet: moving.name, natalPlanet: natalPlanet.name, natalHouse: natalPlanet.house, kind: "opposition", separation: oppositionDistance, applying: futureSeparation(moving, natalPlanet.longitude, 180) < oppositionDistance, exactness: oppositionDistance < 0.25 ? "exact-degree" : "within-orb", provenance: { kind: "astronomical", tradition: "Degree contact", rule: `${moving.name} near 180° from natal ${natalPlanet.name}` }, interpretationLimit: "Degree opposition is a comparison aid and should not be silently conflated with every Jyotish aspect model." });
    }
    for (const count of ASPECT_COUNTS[moving.name]) {
      const targetHouse = ((moving.house + count - 2) % 12) + 1;
      contacts.push({ transitPlanet: moving.name, natalHouse: targetHouse, kind: "graha-aspect", exactness: "whole-sign", provenance: { kind: "traditional-rule", tradition: moving.name === "Rahu" || moving.name === "Ketu" ? "Lineage-dependent node model" : "Parashari graha drishti", rule: `${count}th sign/house count from transit ${moving.name}` }, interpretationLimit: "A sign-based aspect describes attention or activation, not a standalone event prediction." });
    }
  }
  return contacts;
}

export function contactsForNatalHouse(natal: JyotishChart, transit: JyotishChart, house: number, orb = 3): TransitContact[] {
  return transitContacts(natal, transit, orb).filter((contact) => contact.natalHouse === house);
}
