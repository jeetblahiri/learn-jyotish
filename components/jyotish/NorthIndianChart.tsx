"use client";

import { useMemo, useState } from "react";
import styles from "./NorthIndianChart.module.css";

export type ChartPlanet = {
  id: string;
  name: string;
  shortLabel?: string;
  house: number;
  sign: number;
  longitude?: number;
  degree?: number;
  retrograde?: boolean;
  layer?: "natal" | "transit";
};

export type ChartAspect = {
  id?: string;
  fromHouse: number;
  toHouse: number;
  label?: string;
  kind?: "natal" | "transit";
};

export type NorthIndianChartProps = {
  ascendantSign: number;
  planets: ChartPlanet[];
  aspects?: ChartAspect[];
  selectedHouse?: number | null;
  selectedSign?: number | null;
  selectedPlanetId?: string | null;
  showNatal?: boolean;
  showTransits?: boolean;
  labelMode?: "compact" | "full";
  title?: string;
  className?: string;
  onHouseSelect?: (house: number) => void;
  onSignSelect?: (sign: number, house: number) => void;
  onPlanetSelect?: (planet: ChartPlanet) => void;
  onAspectSelect?: (aspect: ChartAspect) => void;
};

type Point = readonly [number, number];

// House 1 is always the upper central field; subsequent houses move counter-clockwise.
const centres: Point[] = [[50,34],[25,13],[12,28],[24,50],[12,72],[25,87],[50,66],[75,87],[88,72],[76,50],[88,28],[75,13]];
const hitAreas = [
  "25,25 50,0 75,25 50,50", "0,0 50,0 25,25", "0,0 25,25 0,50", "0,50 25,25 50,50 25,75", "0,50 25,75 0,100", "0,100 25,75 50,100",
  "25,75 50,50 75,75 50,100", "50,100 75,75 100,100", "75,75 100,50 100,100", "50,50 75,25 100,50 75,75", "75,25 100,0 100,50", "50,0 100,0 75,25",
];
const signNames = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const signShort = ["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];

const validHouse = (house: number) => Math.min(12, Math.max(1, Math.round(house)));
const validSign = (sign: number) => ((Math.round(sign) % 12) + 12) % 12;
const pointBetween = (a: Point, b: Point, amount: number): Point => [a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount];

export function NorthIndianChart({
  ascendantSign, planets, aspects = [], selectedHouse = null, selectedSign = null, selectedPlanetId = null,
  showNatal: showNatalProp = true, showTransits: showTransitsProp = true, labelMode: labelModeProp = "compact",
  title = "North Indian birth chart", className, onHouseSelect, onSignSelect, onPlanetSelect, onAspectSelect,
}: NorthIndianChartProps) {
  const [showNatal, setShowNatal] = useState(showNatalProp);
  const [showTransits, setShowTransits] = useState(showTransitsProp);
  const [labelMode, setLabelMode] = useState(labelModeProp);
  const [openCluster, setOpenCluster] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const asc = validSign(ascendantSign);
  const visible = useMemo(() => planets.filter((planet) => (planet.layer ?? "natal") === "natal" ? showNatal : showTransits), [planets, showNatal, showTransits]);
  const byHouse = useMemo(() => Array.from({ length: 12 }, (_, index) => visible.filter((planet) => validHouse(planet.house) === index + 1)), [visible]);
  const activeAspects = aspects.filter((aspect) => !selectedHouse || aspect.fromHouse === selectedHouse || aspect.toHouse === selectedHouse);
  const aspectedHouses = new Set(activeAspects.flatMap((aspect) => [aspect.fromHouse, aspect.toHouse]));
  const chooseHouse = (house: number) => onHouseSelect?.(house);

  return <section className={`${styles.root}${className ? ` ${className}` : ""}`} aria-label={title}>
    <div className={styles.toolbar}>
      <div className={styles.legend} aria-label="Chart legend"><span><i className={styles.dot} /> Natal</span><span><i className={`${styles.dot} ${styles.transit}`} /> Transit</span><span>H1 fixed at top · houses ↺</span></div>
      <div className={styles.controls} aria-label="Chart display settings">
        <button type="button" aria-pressed={showNatal} onClick={() => setShowNatal((value) => !value)}>Natal</button>
        <button type="button" aria-pressed={showTransits} onClick={() => setShowTransits((value) => !value)}>Transits</button>
        <button type="button" aria-pressed={labelMode === "full"} onClick={() => setLabelMode((value) => value === "full" ? "compact" : "full")}>Full labels</button>
      </div>
    </div>
    <div className={styles.frame}>
      <svg className={styles.diagram} viewBox="0 0 100 100" role="group" aria-label={`${title}. House one is at the top and houses proceed counter-clockwise.`}>
        <path className={styles.grid} d="M0 0H100V100H0Z M50 0L100 50L50 100L0 50Z M0 0L100 100 M100 0L0 100" />
        {hitAreas.map((points, index) => {
          const house = index + 1;
          const sign = validSign(asc + index);
          const isSelected = selectedHouse === house || selectedSign === sign;
          return <polygon key={house} points={points} role="button" tabIndex={0}
            aria-label={`House ${house}, ${signNames[sign]}. ${byHouse[index].length} visible planet${byHouse[index].length === 1 ? "" : "s"}.`}
            className={`${styles.houseHit}${isSelected ? ` ${styles.selected}` : ""}${aspectedHouses.has(house) ? ` ${styles.aspected}` : ""}`}
            onClick={() => chooseHouse(house)} onDoubleClick={() => onSignSelect?.(sign, house)}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); chooseHouse(house); } if (event.key.toLowerCase() === "s") onSignSelect?.(sign, house); }} />;
        })}
        {activeAspects.map((aspect, index) => {
          const start = centres[validHouse(aspect.fromHouse) - 1]; const end = centres[validHouse(aspect.toHouse) - 1];
          const a = pointBetween(start, end, .27); const b = pointBetween(start, end, .73);
          return <g key={aspect.id ?? `${aspect.fromHouse}-${aspect.toHouse}-${index}`} role={onAspectSelect ? "button" : undefined} tabIndex={onAspectSelect ? 0 : undefined}
            aria-label={aspect.label ?? `Aspect from house ${aspect.fromHouse} to house ${aspect.toHouse}`}
            onClick={() => onAspectSelect?.(aspect)} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && onAspectSelect) { event.preventDefault(); onAspectSelect(aspect); } }}>
            <path className={styles.aspect} d={`M${a[0]} ${a[1]} Q50 50 ${b[0]} ${b[1]}`} /><circle className={styles.aspectDot} cx={b[0]} cy={b[1]} r=".9" />
          </g>;
        })}
        {centres.map(([x,y], index) => {
          const house = index + 1; const sign = validSign(asc + index); const occupants = byHouse[index]; const displayed = occupants.slice(0, 3); const cluster = occupants.length > 3;
          return <g key={`labels-${house}`}>
            <text className={`${styles.label} ${styles.houseNumber}`} x={x} y={y - 7}>{house === 1 ? "H1 · LAGNA" : `H${house}`}</text>
            <text className={`${styles.label} ${styles.sign} ${styles.signButton}`} x={x} y={y - 3.5} role="button" tabIndex={0}
              aria-label={`Select ${signNames[sign]} in house ${house}`} onClick={() => onSignSelect?.(sign, house)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSignSelect?.(sign, house); } }}>{labelMode === "full" ? signNames[sign] : `${sign + 1} · ${signShort[sign]}`}</text>
            <g className={styles.planetArea}>
              {displayed.map((planet, planetIndex) => {
                const isTransit = (planet.layer ?? "natal") === "transit"; const py = y + 1 + planetIndex * 4.9;
                const text = labelMode === "full" ? planet.name : (planet.shortLabel ?? planet.name.slice(0,2));
                return <g className={`${styles.planetNode}${isTransit ? ` ${styles.transitNode}` : ""}${selectedPlanetId === planet.id ? ` ${styles.selectedPlanet}` : ""}`} key={planet.id}
                  role="button" tabIndex={0} pointerEvents="all" aria-label={`Select ${isTransit ? "transiting" : "natal"} ${planet.name} in house ${house}, ${signNames[sign]}${planet.retrograde ? ", retrograde" : ""}`}
                  onClick={() => onPlanetSelect?.(planet)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onPlanetSelect?.(planet); } }}>
                  {labelMode === "full" ? <rect x={x - 7} y={py - 1.7} width="14" height="3.5" rx="1.75" /> : <circle cx={x} cy={py} r="2.05" />}
                  <text x={x} y={py}>{isTransit ? "t·" : ""}{text}{planet.retrograde ? "ᴿ" : ""}</text>
                </g>;
              })}
              {cluster && <g className={`${styles.planetNode} ${styles.cluster}`} role="button" tabIndex={0} pointerEvents="all" aria-label={`Show all ${occupants.length} planets in house ${house}`}
                onClick={() => setOpenCluster(house)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpenCluster(house); } }}>
                <rect x={x - 5} y={y + 15.2} width="10" height="3.6" rx="1.8" /><text x={x} y={y + 17}>+{occupants.length - 3} more</text>
              </g>}
            </g>
          </g>;
        })}
        <text className={`${styles.label} ${styles.lagna}`} x="50" y="50">{signNames[asc]} ASC</text>
      </svg>
      {openCluster && <div className={styles.clusterPanel} role="dialog" aria-modal="false" aria-label={`Planets in house ${openCluster}`}>
        <header><b>House {openCluster} · {signNames[validSign(asc + openCluster - 1)]}</b><button type="button" onClick={() => setOpenCluster(null)} aria-label="Close planet list">Close</button></header>
        <div className={styles.clusterList}>{byHouse[openCluster - 1].map((planet) => <button type="button" key={planet.id} onClick={() => { onPlanetSelect?.(planet); setOpenCluster(null); }}>{planet.layer === "transit" ? "Transit " : ""}{planet.name}{planet.retrograde ? " ℞" : ""}</button>)}</div>
      </div>}
    </div>
    <p className={styles.caption}>House positions remain fixed in the North Indian style. Rāśi signs rotate from the ascendant. Click a house or planet; double-click a house (or press S while focused) to select its sign.</p>
    <button className={styles.tableToggle} type="button" aria-expanded={showTable} onClick={() => setShowTable((value) => !value)}>{showTable ? "Hide" : "Show"} accessible chart table</button>
    {showTable && <div className={styles.tableWrap}><table className={styles.table}><caption>{title}: placements by house</caption><thead><tr><th>House</th><th>Sign</th><th>Natal</th><th>Transit</th></tr></thead><tbody>{byHouse.map((occupants, index) => <tr key={index}><th scope="row">{index + 1}</th><td>{signNames[validSign(asc + index)]}</td><td>{occupants.filter((p) => (p.layer ?? "natal") === "natal").map((p) => p.name).join(", ") || "—"}</td><td>{occupants.filter((p) => p.layer === "transit").map((p) => p.name).join(", ") || "—"}</td></tr>)}</tbody></table></div>}
  </section>;
}

export default NorthIndianChart;
