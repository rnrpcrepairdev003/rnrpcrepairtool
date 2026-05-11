const BASE_URL = "https://repairdesk.3cx.us";

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const clientId = process.env.THREECX_CLIENT_ID?.trim();
  const clientSecret = process.env.THREECX_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) throw new Error("THREECX_CLIENT_ID / THREECX_CLIENT_SECRET not configured");

  const res = await fetch(`${BASE_URL}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) throw new Error(`3CX token error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token as string;
  tokenExpiry = Date.now() + (data.expires_in ?? 3600) * 1000 - 30_000;
  return cachedToken;
}

export type ThreeCxCall = {
  callId: string;
  callerNumber: string;
  calleeName: string | null;
  callee: string | null;
  startTime: string;
  talkingDuration: string | null;
  direction: string | null;
  status: string | null;
  recordingUrl: string | null;
};

export async function getCallLog(): Promise<ThreeCxCall[]> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/xapi/v1/ReportCallLog`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`3CX call log error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  // 3CX returns { value: [...] } or an array directly
  const records: unknown[] = Array.isArray(data) ? data : (data.value ?? []);
  return records.map((r: unknown) => {
    const rec = r as Record<string, unknown>;
    return {
      callId: String(rec.Id ?? rec.callId ?? rec.CallId ?? ""),
      callerNumber: String(rec.CallerNumber ?? rec.callerNumber ?? ""),
      calleeName: (rec.CalleeName ?? rec.calleeName ?? null) as string | null,
      callee: (rec.CalleeNumber ?? rec.calleeNumber ?? null) as string | null,
      startTime: String(rec.StartTime ?? rec.startTime ?? new Date().toISOString()),
      talkingDuration: (rec.TalkingDuration ?? rec.talkingDuration ?? null) as string | null,
      direction: (rec.Direction ?? rec.direction ?? null) as string | null,
      status: (rec.Status ?? rec.status ?? null) as string | null,
      recordingUrl: (rec.RecordingUrl ?? rec.recordingUrl ?? null) as string | null,
    };
  });
}
