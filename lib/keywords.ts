export const QUICK_TERMS = [
  // Status
  "Called", "Waiting", "Urgent", "Pickup",
  // Problem type
  "Problem", "Issue", "Diagnostic", "Repair", "Estimate",
  // Hardware
  "Screen", "Display", "Battery", "Motherboard", "Fan", "RAM", "SSD", "GPU",
  "Charging", "Overheating", "Thermal", "Power", "Boot",
  // Data / software
  "Data", "Recovery", "Backup", "Password", "Windows", "Software", "Network", "WiFi",
  // Damage
  "Water", "Liquid", "Physical", "Corrosion",
  // Device type
  "Gaming", "MacBook",
  // Admin
  "Business", "Warranty", "Parts", "Ordered", "Deposit",
];

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchedKeywords(desc: string, terms: string[] = QUICK_TERMS): string[] {
  if (!desc) return [];
  return terms.filter((term) =>
    new RegExp(`\\b${escapeRegex(term)}\\b`, "i").test(desc)
  );
}
