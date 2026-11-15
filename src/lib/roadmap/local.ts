import { useCallback, useEffect, useState } from "react";
import { toRoadmapData } from "./adapter";
import type { RoadmapData, Status } from "./types";
import type { StatusMap } from "./progress";

const STATUS_KEY = "tel:roadmap-status";
const FILE_KEY = "tel:roadmap-file";

/** Todo / Dev / Done per task, kept on this device. */
export function useTaskStatus() {
  const [map, setMap] = useState<StatusMap>({});
  useEffect(() => {
    try {
      setMap(JSON.parse(localStorage.getItem(STATUS_KEY) ?? "{}"));
    } catch {
      setMap({});
    }
  }, []);
  const set = useCallback((id: string, status: Status) => {
    setMap((prev) => {
      const next = { ...prev };
      if (status === "todo") delete next[id];
      else next[id] = status;
      localStorage.setItem(STATUS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return { map, set };
}

/** Roadmap export imported from a file, used until a live feed is connected. */
export function useImportedRoadmap() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FILE_KEY);
      if (raw) setData({ connected: true, source: "file", ...toRoadmapData(JSON.parse(raw)) });
    } catch {
      localStorage.removeItem(FILE_KEY);
    }
    setReady(true);
  }, []);
  const importText = (text: string) => {
    const parsed = toRoadmapData(JSON.parse(text));
    const days = Object.values(parsed.plans).reduce((n, d) => n + (d?.length ?? 0), 0);
    if (!days && !parsed.problems.length) throw new Error("No roadmap days or problems found in this file.");
    localStorage.setItem(FILE_KEY, text);
    setData({ connected: true, source: "file", ...parsed });
    return { days, problems: parsed.problems.length };
  };
  const clear = () => {
    localStorage.removeItem(FILE_KEY);
    setData(null);
  };
  return { data, ready, importText, clear };
}
