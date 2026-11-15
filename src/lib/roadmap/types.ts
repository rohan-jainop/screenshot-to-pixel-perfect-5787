export const PLAN_IDS = ["3m", "6m", "9m"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

/** Plan labels from the product brief; the schedule itself always comes from the roadmap data. */
export const PLANS: Record<PlanId, { name: string; tagline: string; days: number; focus: string; timeline: string }> = {
  "3m": { name: "3-Month Plan", tagline: "Fast Track", days: 90, focus: "High-frequency interview problems and essential design concepts.", timeline: "3-Month Fast-Track Timeline" },
  "6m": { name: "6-Month Plan", tagline: "Comprehensive", days: 180, focus: "Comprehensive preparation across DSA, LLD and HLD.", timeline: "6-Month Comprehensive Timeline" },
  "9m": { name: "9-Month Plan", tagline: "Deep Dive", days: 270, focus: "Advanced, in-depth concepts with extensive practice.", timeline: "9-Month Deep-Dive Timeline" },
};

export const STATUSES = ["todo", "dev", "done"] as const;
export type Status = (typeof STATUSES)[number];
export const STATUS_LABEL: Record<Status, string> = { todo: "Todo", dev: "Dev", done: "Done" };

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type TaskKind = "dsa" | "lld" | "hld";

export interface Task {
  id: string;
  kind: TaskKind;
  title: string;
  number?: number | undefined;
  askedBy?: number | undefined;
  difficulty?: Difficulty | undefined;
  topics: string[];
  companies: string[];
  practiceUrl?: string | undefined;
  videoUrl?: string | undefined;
  solutionUrl?: string | undefined;
}

export interface RoadmapDay {
  day: number;
  title: string;
  categories: string[];
  tasks: Task[];
}

export interface RoadmapData {
  connected: boolean;
  source?: "feed" | "file" | undefined;
  plans: Partial<Record<PlanId, RoadmapDay[]>>;
  problems: Task[];
  scope: string[];
  mentorUrl?: string | undefined;
  error?: string | undefined;
}

export const SHEET_SORTS = ["default", "frequency", "difficulty", "title"] as const;
export type SheetSort = (typeof SHEET_SORTS)[number];

export interface SheetFilters {
  q?: string | undefined;
  topic?: string | undefined;
  difficulty?: Difficulty | undefined;
  company?: string | undefined;
  status?: Status | undefined;
  sort?: SheetSort | undefined;
  page?: number | undefined;
}
