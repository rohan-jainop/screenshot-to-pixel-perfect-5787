import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { toRoadmapData } from "./adapter";
import type { RoadmapData } from "./types";

const empty = { plans: {}, problems: [], scope: [] };

/** Reads roadmaps and the problems sheet from the existing data feed (ROADMAP_FEED_URL). No feed = not connected. */
export const fetchRoadmap = createServerFn({ method: "GET" }).handler(async (): Promise<RoadmapData> => {
  const url = process.env["ROADMAP_FEED_URL"];
  if (!url) return { connected: false, ...empty };
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (process.env["ROADMAP_FEED_TOKEN"]) headers["Authorization"] = `Bearer ${process.env["ROADMAP_FEED_TOKEN"]}`;
    const res = await fetch(url, { headers });
    if (!res.ok) return { connected: true, source: "feed", ...empty, error: `Roadmap feed responded ${res.status}` };
    return { connected: true, source: "feed", ...toRoadmapData(await res.json()) };
  } catch (e) {
    return { connected: true, source: "feed", ...empty, error: e instanceof Error ? e.message : "Could not reach the roadmap feed" };
  }
});

export const roadmapQueryOptions = () =>
  queryOptions({ queryKey: ["roadmap"], queryFn: () => fetchRoadmap(), staleTime: 10 * 60_000 });
