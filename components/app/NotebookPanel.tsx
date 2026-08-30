"use client";

import { FormEvent, useState } from "react";
import type { NotebookEntry } from "@/lib/workspace-storage";
import styles from "./notebook.module.css";

const evidenceLabels: Record<NotebookEntry["evidence"], string> = {
  observation: "Observation",
  hypothesis: "Hypothesis",
  support: "Supporting evidence",
  counter: "Counter-evidence",
  outcome: "Outcome note",
};

export function NotebookPanel({ entries, chartId, onAdd, onDelete }: {
  entries: NotebookEntry[];
  chartId: string;
  onAdd: (entry: NotebookEntry) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [evidence, setEvidence] = useState<NotebookEntry["evidence"]>("observation");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onAdd({
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      chartId,
      title: title.trim(),
      body: body.trim(),
      evidence,
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    setBody("");
  }

  const chartEntries = entries.filter((entry) => entry.chartId === chartId);

  return (
    <div className={styles.notebookGrid}>
      <form className={styles.noteComposer} onSubmit={submit}>
        <p className={styles.eyebrow}>Reasoning journal</p>
        <h2>Record what the chart teaches you</h2>
        <p>Keep observations separate from hypotheses, support and counter-evidence. This makes later review much more honest.</p>
        <label>
          Evidence type
          <select value={evidence} onChange={(event) => setEvidence(event.target.value as NotebookEntry["evidence"])}>
            {Object.entries(evidenceLabels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
          </select>
        </label>
        <label>
          Note title
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Repeating tenth-house theme" />
        </label>
        <label>
          Observation or reasoning
          <textarea rows={7} value={body} onChange={(event) => setBody(event.target.value)} placeholder="State the rule, what you observed, and what could contradict it." />
        </label>
        <button type="submit">Save note locally</button>
      </form>
      <section className={styles.noteList} aria-labelledby="saved-notes-title">
        <div>
          <p className={styles.eyebrow}>Private on this device</p>
          <h2 id="saved-notes-title">Saved notes</h2>
        </div>
        {chartEntries.length ? chartEntries.map((entry) => (
          <article key={entry.id} className={`${styles.noteCard} ${styles[entry.evidence]}`}>
            <header>
              <span>{evidenceLabels[entry.evidence]}</span>
              <button type="button" onClick={() => onDelete(entry.id)} aria-label={`Delete ${entry.title}`}>Delete</button>
            </header>
            <h3>{entry.title}</h3>
            <p>{entry.body}</p>
            <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
          </article>
        )) : <div className={styles.emptyNote}><b>No observations yet.</b><span>Start with one concrete placement, then add support or counter-evidence.</span></div>}
      </section>
    </div>
  );
}
