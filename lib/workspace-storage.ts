export type StoredChart = {
  id: string;
  name: string;
  date: string;
  time: string;
  placeId: string;
  placeLabel: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  reliability: "exact" | "recalled" | "rounded" | "approximate" | "unknown";
  createdAt: string;
};

export type NotebookEntry = {
  id: string;
  chartId: string;
  title: string;
  body: string;
  evidence: "observation" | "hypothesis" | "support" | "counter" | "outcome";
  createdAt: string;
};

export type LearningProgress = Record<string, { completed: boolean; score?: number }>;

export type WorkspaceSnapshot = {
  charts: StoredChart[];
  notebook: NotebookEntry[];
  progress: LearningProgress;
  settings: {
    density: "comfortable" | "compact";
    contrast: "standard" | "high";
    transliteration: "diacritics" | "plain";
  };
};

export const emptyWorkspace: WorkspaceSnapshot = {
  charts: [],
  notebook: [],
  progress: {},
  settings: { density: "comfortable", contrast: "standard", transliteration: "diacritics" },
};

const STORAGE_KEY = "drishti.workspace.v2";

export function readWorkspace(): WorkspaceSnapshot {
  if (typeof window === "undefined") return emptyWorkspace;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return emptyWorkspace;
    const parsed = JSON.parse(value) as Partial<WorkspaceSnapshot>;
    return {
      charts: Array.isArray(parsed.charts) ? parsed.charts : [],
      notebook: Array.isArray(parsed.notebook) ? parsed.notebook : [],
      progress: parsed.progress ?? {},
      settings: { ...emptyWorkspace.settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return emptyWorkspace;
  }
}

export function writeWorkspace(snapshot: WorkspaceSnapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function exportWorkspace(snapshot: WorkspaceSnapshot) {
  return JSON.stringify({ format: "drishti-workspace", version: 2, exportedAt: new Date().toISOString(), ...snapshot }, null, 2);
}
