"use client";

import { useId, useState } from "react";
import styles from "./EvidenceTrail.module.css";

export type EvidenceKind="supporting"|"modifying"|"counter";
export type EvidenceStrength="foundational"|"strong"|"supporting"|"weak"|"tradition-dependent";
export type EvidenceItem={ id:string; kind:EvidenceKind; statement:string; rule?:string; source?:string; strength?:EvidenceStrength; targetId?:string; metadata?:string };
export type EvidenceTrailProps={
  title?:string; claim:string; evidence:EvidenceItem[]; confidence?:"low"|"moderate"|"high"|"mixed"; tradition?:string; statementType?:"astronomical fact"|"traditional rule"|"interpretive hypothesis";
  caveat?:string; defaultExpanded?:EvidenceKind[]; className?:string; onEvidenceSelect?:(item:EvidenceItem)=>void;
};

const groups:{kind:EvidenceKind;label:string;symbol:string;empty:string}[]=[
  {kind:"supporting",label:"Supporting evidence",symbol:"+",empty:"No supporting evidence has been attached."},
  {kind:"modifying",label:"Modifying conditions",symbol:"±",empty:"No modifying conditions have been attached."},
  {kind:"counter",label:"Counter-indications",symbol:"−",empty:"No counter-indications have been attached."},
];

export function EvidenceTrail({title="Interpretation audit trail",claim,evidence,confidence="mixed",tradition,statementType="interpretive hypothesis",caveat="Treat this as a structured hypothesis. Context, repetition and timing determine whether and how it manifests.",defaultExpanded=["supporting","modifying","counter"],className,onEvidenceSelect}:EvidenceTrailProps){
  const uid=useId().replace(/:/g,""); const [expanded,setExpanded]=useState<Set<EvidenceKind>>(()=>new Set(defaultExpanded));
  const toggle=(kind:EvidenceKind)=>setExpanded((current)=>{const next=new Set(current);if(next.has(kind))next.delete(kind);else next.add(kind);return next;});
  return <article className={`${styles.root}${className?` ${className}`:""}`}>
    <header className={styles.header}><p className={styles.eyebrow}>{title}</p><h3>{claim}</h3><p className={styles.claim}>Inspect the rule chain before accepting the interpretation.</p><div className={styles.meta}><span className={styles.badge}>{statementType}</span>{tradition&&<span className={styles.badge}>{tradition}</span>}</div></header>
    <div className={styles.body}>{groups.map((group)=>{const items=evidence.filter((item)=>item.kind===group.kind);const open=expanded.has(group.kind);const panelId=`evidence-${uid}-${group.kind}`;return <section key={group.kind} className={`${styles.group} ${styles[group.kind==="supporting"?"support":group.kind==="modifying"?"modify":"counter"]}`}>
      <button className={styles.groupButton} type="button" aria-expanded={open} aria-controls={panelId} onClick={()=>toggle(group.kind)}><span className={styles.icon} aria-hidden="true">{group.symbol}</span><span><b>{group.label}</b><br/><small>{items.length} item{items.length===1?"":"s"}</small></span><span className={`${styles.chevron}${open?` ${styles.open}`:""}`} aria-hidden="true">⌄</span></button>
      {open&&<div id={panelId}>{items.length?<ol className={styles.items}>{items.map((item)=><li className={styles.item} key={item.id}><div><p>{item.statement}</p><footer>{item.strength&&<span className={styles.strength}>{item.strength}</span>}{item.rule&&<span>Rule: {item.rule}</span>}{item.source&&<span>Source: {item.source}</span>}{item.metadata&&<span>{item.metadata}</span>}</footer></div>{onEvidenceSelect&&<button type="button" onClick={()=>onEvidenceSelect(item)}>Show in chart</button>}</li>)}</ol>:<p className={styles.empty}>{group.empty}</p>}</div>}
    </section>})}</div>
    <footer className={styles.footer}><p>{caveat}</p><div className={styles.confidence}><span>Qualitative confidence</span><b>{confidence}</b></div></footer>
  </article>;
}

export default EvidenceTrail;
