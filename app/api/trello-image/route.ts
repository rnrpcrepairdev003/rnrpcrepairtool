import { NextRequest, NextResponse } from "next/server";
import convert from "heic-convert";

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  if (!src) return NextResponse.json({ error: "Missing src" }, { status: 400 });

  const isTrelloDirect =
    src.includes("api.trello.com") || src.includes("trello.com/1/");

  const fetchHeaders: Record<string, string> = {};
  if (isTrelloDirect) {
    const key = process.env.TRELLO_API_KEY!.trim();
    const token = process.env.TRELLO_TOKEN!.trim();
    fetchHeaders["Authorization"] = `OAuth oauth_consumer_key="${key}", oauth_token="${token}"`;
  }

  try {
    const res = await fetch(src, { redirect: "follow", headers: fetchHeaders });
    if (!res.ok) {
      console.error(`[trello-image] Upstream ${res.status} for ${src}`);
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isHeic =
      contentType.includes("heic") ||
      contentType.includes("heif") ||
      src.toLowerCase().includes(".heic") ||
      src.toLowerCase().includes(".heif");

    if (isHeic) {
      const jpeg = await convert({ buffer: buffer as unknown as ArrayBuffer, format: "JPEG", quality: 0.9 });
      return new NextResponse(new Uint8Array(jpeg), {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error(`[trello-image] fetch failed for ${src}:`, e);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}
