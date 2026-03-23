import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Rate limit: IP -> timestamp последнего запроса для каждого навыка
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 10_000; // 1 установка на навык с одного IP раз в 10 секунд
const CLEANUP_INTERVAL = 60_000;

// Чистим карту раз в минуту чтобы не утекала память
let lastCleanup = Date.now();
function cleanup() {
  if (Date.now() - lastCleanup < CLEANUP_INTERVAL) return;
  const now = Date.now();
  for (const [key, ts] of rateLimitMap) {
    if (now - ts > RATE_LIMIT_MS * 10) rateLimitMap.delete(key);
  }
  lastCleanup = now;
}

export async function POST(request: NextRequest) {
  try {
    const { name, owner, repo, v } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    // Проверяем что запрос от CLI (есть версия)
    if (!v) {
      return NextResponse.json({ tracked: false, reason: "missing client version" });
    }

    // Rate limit по IP + skill name
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const key = `${ip}:${name}`;

    cleanup();

    const lastRequest = rateLimitMap.get(key) || 0;
    if (Date.now() - lastRequest < RATE_LIMIT_MS) {
      return NextResponse.json({ tracked: false, reason: "rate limited" }, { status: 429 });
    }
    rateLimitMap.set(key, Date.now());

    // Ищем навык
    const where = owner && repo
      ? { name, owner, repo }
      : { name };

    const skill = await prisma.skill.findFirst({ where });

    if (!skill) {
      return NextResponse.json({ tracked: false, reason: "skill not in catalog" });
    }

    await prisma.skill.update({
      where: { id: skill.id },
      data: {
        installs: { increment: 1 },
        trending24h: { increment: 1 },
      },
    });

    return NextResponse.json({ tracked: true, installs: skill.installs + 1 });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
