"use client";

import { PointerEvent as ReactPointerEvent, useId, useMemo, useRef, useState } from "react";
import styles from "./SkySphere.module.css";

export type SkyPlanet = { id:string; name:string; shortLabel?:string; longitude:number; latitude?:number; color?:string; metadata?:string };
export type SkyLayer = "zodiac"|"ecliptic"|"horizon"|"equator"|"nakshatras";
export type SkySphereProps = {
  planets:SkyPlanet[]; selectedPlanetId?:string|null; initialRotation?:number; initialTilt?:number; enabledLayers?:SkyLayer[];
  title?:string; className?:string; onPlanetSelect?:(planet:SkyPlanet)=>void; onViewChange?:(view:{rotation:number;tilt:number})=>void;
};

const zodiac=["Ar","Ta","Ge","Cn","Le","Vi","Li","Sc","Sg","Cp","Aq","Pi"];
const normal=(n:number)=>((n%360)+360)%360;
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
const rad=(n:number)=>n*Math.PI/180;
type P={x:number;y:number;z:number};

function project(longitude:number, latitude:number, rotation:number, tilt:number, radius=37):P {
  const l=rad(longitude+rotation), b=rad(latitude), t=rad(tilt);
  const x=Math.cos(b)*Math.cos(l); const y=Math.cos(b)*Math.sin(l); const z=Math.sin(b);
  const yy=y*Math.cos(t)-z*Math.sin(t); const zz=y*Math.sin(t)+z*Math.cos(t);
  return {x:50+x*radius,y:50-yy*radius,z:zz};
}

function segmentedCurve(latitude:(longitude:number)=>number,rotation:number,tilt:number){
  const front:string[]=[]; const rear:string[]=[];
  for(let lon=0;lon<=360;lon+=4){const p=project(lon,latitude(lon),rotation,tilt);const target=p.z>=0?front:rear;target.push(`${target.length?"L":"M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`);}
  return {front:front.join(" "),rear:rear.join(" ")};
}

export function SkySphere({planets,selectedPlanetId=null,initialRotation=0,initialTilt=24,enabledLayers=["zodiac","ecliptic","horizon","equator"],title="Interactive geocentric sky",className,onPlanetSelect,onViewChange}:SkySphereProps){
  const [rotation,setRotation]=useState(initialRotation); const [tilt,setTilt]=useState(initialTilt); const [layers,setLayers]=useState<Set<SkyLayer>>(()=>new Set(enabledLayers));
  const drag=useRef<{x:number;y:number;rotation:number;tilt:number}|null>(null); const gradientId=useId().replace(/:/g,"");
  const ecliptic=useMemo(()=>segmentedCurve(()=>0,rotation,tilt),[rotation,tilt]);
  const equator=useMemo(()=>segmentedCurve((lon)=>23.44*Math.sin(rad(lon)),rotation,tilt),[rotation,tilt]);
  const horizon=useMemo(()=>segmentedCurve((lon)=>55*Math.sin(rad(lon+30)),rotation,tilt),[rotation,tilt]);
  const setView=(nextRotation:number,nextTilt:number)=>{const view={rotation:normal(nextRotation),tilt:clamp(nextTilt,-80,80)};setRotation(view.rotation);setTilt(view.tilt);onViewChange?.(view);};
  const toggle=(layer:SkyLayer)=>setLayers((current)=>{const next=new Set(current);if(next.has(layer))next.delete(layer);else next.add(layer);return next;});
  const onPointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{event.currentTarget.setPointerCapture(event.pointerId);drag.current={x:event.clientX,y:event.clientY,rotation,tilt};};
  const onPointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{if(!drag.current)return;setView(drag.current.rotation+(event.clientX-drag.current.x)*.38,drag.current.tilt-(event.clientY-drag.current.y)*.28);};
  const stopDrag=()=>{drag.current=null;};
  const selected=planets.find((planet)=>planet.id===selectedPlanetId);
  const stars=useMemo(()=>Array.from({length:72},(_,i)=>({x:16+((i*37)%68),y:13+((i*53)%74),r:.08+(i%4)*.035})),[]);

  return <section className={`${styles.root}${className?` ${className}`:""}`} aria-label={title}>
    <header className={styles.header}><div><h3>{title}</h3><p>A longitude-faithful celestial sphere. Planet dots use real angular coordinates; radial distances and star positions are illustrative, not to scale.</p></div><button className={styles.reset} type="button" onClick={()=>setView(0,24)}>Reset view</button></header>
    <div className={styles.toggles} aria-label="Sky layers">{(["zodiac","ecliptic","horizon","equator","nakshatras"] as SkyLayer[]).map((layer)=><button key={layer} type="button" aria-pressed={layers.has(layer)} onClick={()=>toggle(layer)}>{layer[0].toUpperCase()+layer.slice(1)}</button>)}</div>
    <div className={styles.viewport} role="application" tabIndex={0} aria-label="Rotatable celestial sphere. Drag to rotate. Use arrow keys to rotate and tilt, Home to reset."
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}
      onKeyDown={(event)=>{let r=rotation,t=tilt;if(event.key==="ArrowLeft")r-=5;else if(event.key==="ArrowRight")r+=5;else if(event.key==="ArrowUp")t+=5;else if(event.key==="ArrowDown")t-=5;else if(event.key==="Home"){r=0;t=24;}else return;event.preventDefault();setView(r,t);}}>
      <svg className={styles.svg} viewBox="0 0 100 100" role="group" aria-label="Celestial sphere with selectable planetary positions">
        <defs><radialGradient id={`skySphereFill-${gradientId}`} cx="43%" cy="35%"><stop offset="0" stopColor="#285246"/><stop offset=".62" stopColor="#102a26"/><stop offset="1" stopColor="#071512"/></radialGradient></defs>
        <circle className={styles.glow} cx="50" cy="50" r="38.5"/><circle className={styles.sphere} cx="50" cy="50" r="37" style={{fill:`url(#skySphereFill-${gradientId})`}}/>
        {stars.map((star,index)=><circle key={index} className={styles.star} cx={star.x} cy={star.y} r={star.r}/>) }
        {layers.has("ecliptic")&&<><path className={`${styles.curve} ${styles.ecliptic} ${styles.rear}`} d={ecliptic.rear}/><path className={`${styles.curve} ${styles.ecliptic}`} d={ecliptic.front}/></>}
        {layers.has("equator")&&<><path className={`${styles.curve} ${styles.equator} ${styles.rear}`} d={equator.rear}/><path className={`${styles.curve} ${styles.equator}`} d={equator.front}/></>}
        {layers.has("horizon")&&<><path className={`${styles.curve} ${styles.horizon} ${styles.rear}`} d={horizon.rear}/><path className={`${styles.curve} ${styles.horizon}`} d={horizon.front}/></>}
        {layers.has("nakshatras")&&Array.from({length:27},(_,index)=>{const p1=project(index*360/27,0,rotation,tilt,34);const p2=project(index*360/27,0,rotation,tilt,37);return <line key={index} className={styles.nakshatra} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}/>})}
        {layers.has("zodiac")&&zodiac.map((label,index)=>{const p=project(index*30+15,0,rotation,tilt,32);return <text key={label} className={styles.zodiac} x={p.x} y={p.y} opacity={p.z>=0?1:.25}>{label}</text>})}
        {planets.slice().sort((a,b)=>project(a.longitude,a.latitude??0,rotation,tilt).z-project(b.longitude,b.latitude??0,rotation,tilt).z).map((planet)=>{const p=project(planet.longitude,planet.latitude??0,rotation,tilt);const selectedNow=planet.id===selectedPlanetId;return <g key={planet.id} className={`${styles.planet}${p.z<0?` ${styles.backPlanet}`:""}${selectedNow?` ${styles.selected}`:""}${selectedPlanetId&&!selectedNow?` ${styles.dimmed}`:""}`} role="button" tabIndex={0}
          aria-label={`${planet.name}, longitude ${normal(planet.longitude).toFixed(2)} degrees${planet.latitude!==undefined?`, latitude ${planet.latitude.toFixed(2)} degrees`:""}`}
          onClick={()=>onPlanetSelect?.(planet)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();onPlanetSelect?.(planet);}}}>
          {selectedNow&&<line x1="50" y1="50" x2={p.x} y2={p.y}/>}<circle cx={p.x} cy={p.y} r={selectedNow?2.7:2.15} style={planet.color?{stroke:planet.color}:undefined}/><text x={p.x} y={p.y}>{planet.shortLabel??planet.name.slice(0,2)}</text><text className={styles.name} x={p.x} y={p.y-4}>{planet.name}</text>
        </g>})}
        <text className={styles.axisLabel} x="50" y="8">Celestial north</text><text className={styles.axisLabel} x="50" y="94">Celestial south</text>
      </svg>
      <div className={styles.orientation}><span>Rotation {Math.round(rotation)}°</span><span>Tilt {Math.round(tilt)}°</span></div>
    </div>
    <div className={styles.readout} aria-live="polite"><div><span>Selected body</span><b>{selected?.name??"Choose a planet"}</b></div><div><span>Sidereal longitude</span><b>{selected?`${normal(selected.longitude).toFixed(2)}° · ${zodiac[Math.floor(normal(selected.longitude)/30)]}`:"—"}</b></div><div><span>Learning link</span><b>{selected?.metadata??"Select a body to connect sky and chart"}</b></div></div>
    <p className={styles.srOnly}>Planet positions: {planets.map((planet)=>`${planet.name} ${normal(planet.longitude).toFixed(2)} degrees`).join(", ")}.</p>
  </section>;
}

export default SkySphere;
