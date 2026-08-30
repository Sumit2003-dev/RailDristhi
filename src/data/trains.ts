import { trainRoutes as generatedRoutes } from "./generated/routes";

export type { Halt, TrainRoute } from "./trainTypes";

export const trainRoutes = generatedRoutes;

export function findTrains(query: string): (typeof trainRoutes)[number][] {
  const q = query.trim().toLowerCase();
  if (!q) return trainRoutes;
  return trainRoutes.filter(
    (t) =>
      t.number.includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.halts.some((s) => s.code.toLowerCase() === q || s.name.toLowerCase().includes(q)),
  );
}

export function getTrain(number: string) {
  return trainRoutes.find((t) => t.number === number);
}
