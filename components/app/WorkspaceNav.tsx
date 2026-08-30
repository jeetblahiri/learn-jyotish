"use client";

import styles from "./workspace.module.css";

export type WorkspaceSection =
  | "learn"
  | "chart"
  | "synthesis"
  | "timing"
  | "sky"
  | "cases"
  | "practice"
  | "notebook"
  | "glossary"
  | "settings";

const sections: Array<{ id: WorkspaceSection; label: string; short: string }> = [
  { id: "learn", label: "Learn", short: "01" },
  { id: "chart", label: "Chart lab", short: "02" },
  { id: "synthesis", label: "Interpret", short: "03" },
  { id: "timing", label: "Timing", short: "04" },
  { id: "sky", label: "Sky", short: "05" },
  { id: "cases", label: "Cases", short: "06" },
  { id: "practice", label: "Practice", short: "07" },
  { id: "notebook", label: "Notebook", short: "08" },
  { id: "glossary", label: "Glossary", short: "09" },
  { id: "settings", label: "Settings", short: "10" },
];

export function WorkspaceNav({ active, onChange }: { active: WorkspaceSection; onChange: (section: WorkspaceSection) => void }) {
  return (
    <nav className={styles.workspaceNav} aria-label="Drishti workspaces">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={active === section.id ? styles.activeNav : undefined}
          aria-current={active === section.id ? "page" : undefined}
          onClick={() => onChange(section.id)}
        >
          <span>{section.short}</span>
          <b>{section.label}</b>
        </button>
      ))}
    </nav>
  );
}

export const workspaceSections = sections;
