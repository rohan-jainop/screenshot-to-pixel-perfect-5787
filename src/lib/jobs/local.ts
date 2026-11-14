import { useCallback, useEffect, useState } from "react";

function useStoredList(key: string) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      setIds(JSON.parse(localStorage.getItem(key) ?? "[]"));
    } catch {
      setIds([]);
    }
  }, [key]);
  const write = useCallback(
    (next: string[]) => {
      setIds(next);
      localStorage.setItem(key, JSON.stringify(next));
    },
    [key],
  );
  return [ids, write] as const;
}

export function useSavedJobs() {
  const [ids, write] = useStoredList("tel:saved-jobs");
  const toggle = (id: string) => {
    const saved = ids.includes(id);
    write(saved ? ids.filter((i) => i !== id) : [id, ...ids]);
    return !saved;
  };
  return { ids, isSaved: (id: string) => ids.includes(id), toggle };
}

export function useRecentlyViewed() {
  const [ids, write] = useStoredList("tel:recent-jobs");
  const add = (id: string) => write([id, ...ids.filter((i) => i !== id)].slice(0, 10));
  return { ids, add };
}
