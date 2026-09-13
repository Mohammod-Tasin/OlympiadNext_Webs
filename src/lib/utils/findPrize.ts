import type { PrizeResponse } from "@/types/prize";

/** The prize tier covering a given rank, or undefined if none is
 * configured for that rank (or rank is missing — shouldn't happen for a
 * "winner" decision per the backend, but handled defensively). */
export function findPrize(prizes: PrizeResponse[] | null, rank: number | undefined): PrizeResponse | undefined {
  if (!prizes || rank == null) return undefined;
  return prizes.find((p) => rank >= p.rank_from && rank <= p.rank_to);
}
