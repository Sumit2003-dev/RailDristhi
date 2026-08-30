import { useEffect, useState } from "react";

/** Returns a Date that ticks every `ms`, or null before hydration (SSR-safe). */
export function useLiveClock(ms = 5000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);

  return now;
}
