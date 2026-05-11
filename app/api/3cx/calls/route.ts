import { NextResponse } from "next/server";
import { getCallLog } from "@/lib/threecx";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const calls = await getCallLog();

    // Upsert all calls so transcripts/AI responses are preserved
    await Promise.all(
      calls.map((c) =>
        prisma.callRecord.upsert({
          where: { threecxCallId: c.callId },
          update: {
            callerPhone: c.callerNumber,
            callerName: c.calleeName,
            callee: c.callee,
            callDate: new Date(c.startTime),
            duration: c.talkingDuration,
            direction: c.direction,
            status: c.status,
            recordingUrl: c.recordingUrl,
          },
          create: {
            threecxCallId: c.callId,
            callerPhone: c.callerNumber,
            callerName: c.calleeName,
            callee: c.callee,
            callDate: new Date(c.startTime),
            duration: c.talkingDuration,
            direction: c.direction,
            status: c.status,
            recordingUrl: c.recordingUrl,
          },
        })
      )
    );

    const records = await prisma.callRecord.findMany({
      orderBy: { callDate: "desc" },
    });

    return NextResponse.json(records);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
