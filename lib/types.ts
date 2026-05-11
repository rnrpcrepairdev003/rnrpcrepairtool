export type Tier = "HIGH" | "MEDIUM" | "LOW" | "PENDING";

export type TrelloCardOverride = {
  trelloCardId: string;
  aiScore: number | null;
  notes: string | null;
  aiResponse: string | null;
  updatedAt: Date;
};
