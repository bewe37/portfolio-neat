import { Redis } from "@upstash/redis"
import { NextRequest, NextResponse } from "next/server"

const kv = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const KEY    = "companions:v1"
const MAX    = 1000         // keep the 1000 most recent drawings — change freely, each 16×16 PNG is ~200 bytes
const RL_TTL = 60 * 60 * 24 // one submission per IP per 24 h

export async function GET() {
  try {
    const companions = await kv.lrange<string>(KEY, 0, -1)
    return NextResponse.json({ companions: companions ?? [] })
  } catch {
    return NextResponse.json({ companions: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url?: string }

    if (typeof url !== "string" || !url.startsWith("data:image/png;base64,")) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 })
    }
    if (url.length > 4000) {
      return NextResponse.json({ error: "Too large" }, { status: 400 })
    }

    // One submission per IP per 24 h
    const ip  = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const rlKey = `rl:companion:${ip}`
    if (await kv.get(rlKey)) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 })
    }

    await kv.lpush(KEY, url)
    await kv.ltrim(KEY, 0, MAX - 1)
    await kv.set(rlKey, 1, { ex: RL_TTL })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
