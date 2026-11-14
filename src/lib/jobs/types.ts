export const LEVELS = [
  "Intern / Graduate",
  "SDE-1",
  "SDE-2",
  "Senior / SDE-3",
  "Staff / Lead",
  "Manager / Principal",
] as const;
export type Level = (typeof LEVELS)[number];

export const DOMAINS = [
  "Backend",
  "Frontend",
  "Fullstack",
  "DevOps / SRE / Cloud",
  "Data / AI / ML",
  "Mobile",
  "Security / QA / Infra",
  "Management / Lead",
] as const;
export type Domain = (typeof DOMAINS)[number];

export const WORK_MODES = ["Remote", "Hybrid", "Onsite"] as const;
export type WorkMode = (typeof WORK_MODES)[number];

export const DATE_RANGES = { "24h": 1, "7d": 7, "30d": 30 } as const;
export type DateRange = keyof typeof DATE_RANGES;

export const SORTS = ["newest", "relevance", "level", "company"] as const;
export type Sort = (typeof SORTS)[number];

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string | undefined;
  location: string;
  workMode?: WorkMode | undefined;
  level?: Level | undefined;
  domain?: Domain | undefined;
  skills: string[];
  postedAt?: string | undefined; // ISO
  salary?: string | undefined;
  applyUrl: string;
}

export interface JobsResult {
  connected: boolean;
  jobs: Job[];
  refreshedAt?: string | undefined;
  error?: string | undefined;
}

export interface JobFilters {
  q?: string | undefined;
  companies?: string[] | undefined;
  levels?: Level[] | undefined;
  domains?: Domain[] | undefined;
  modes?: WorkMode[] | undefined;
  location?: string | undefined;
  posted?: DateRange | undefined;
  sort?: Sort | undefined;
  page?: number | undefined;
  view?: "list" | "grid" | undefined;
}
