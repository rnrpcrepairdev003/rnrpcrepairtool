import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { KNOWLEDGE_BASE } from "@/lib/csr-kb";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const { message, history = [] }: { message: string; history: Message[] } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: `You are an internal AI assistant for RNRPC Repair, a computer repair shop in Palm Desert, CA. You help our customer service representative Kate handle incoming customer calls.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}

INSTRUCTIONS:
- Only use information from the knowledge base above. Never make up pricing, turnaround times, or scripts.
- If the symptom doesn't clearly match any entry, say so and ask for more details.
- Respond in valid JSON matching this exact shape:

{
  "possibleIssues": ["string", ...],
  "askCustomer": ["string", ...],
  "script": "string Kate can read directly to the customer",
  "pricing": "string",
  "turnaround": "string",
  "location": "In-Office | Remote | On-Site | Remote first",
  "dataBackup": true | false | null,
  "urgent": true | false,
  "warning": "string or null — only if there is a specific warning Kate must say",
  "confidence": "high | medium | low"
}

- Keep "script" natural and concise — something Kate can say word for word.
- If the customer clearly needs In-Office drop-off, set location accordingly.
- Set urgent to true only for server/NAS emergencies or data loss situations.
- If you need more info to narrow it down, set confidence to "low" and include clarifying questions in askCustomer.`,
    messages: [
      ...history,
      { role: "user", content: message },
    ],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    return NextResponse.json({ result: parsed, assistantMessage: raw });
  } catch {
    return NextResponse.json({ result: null, raw }, { status: 200 });
  }
}
