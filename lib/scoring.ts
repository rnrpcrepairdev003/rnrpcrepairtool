import type { Tier } from "./types";

export function scoreTier(score: number | null): Tier {
  if (!score) return "PENDING";
  if (score >= 67) return "HIGH";
  if (score >= 34) return "MEDIUM";
  return "LOW";
}

export function tierOrder(tier: Tier): number {
  return { HIGH: 3, MEDIUM: 2, LOW: 1, PENDING: 0 }[tier];
}
