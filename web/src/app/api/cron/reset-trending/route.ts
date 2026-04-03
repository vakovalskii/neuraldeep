import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "skillsbd-cron-2026";

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Reset trending24h to 0 for all skills
  const result = await prisma.skill.updateMany({
    data: { trending24h: 0 },
  });

  return NextResponse.json({
    reset: true,
    count: result.count,
    timestamp: new Date().toISOString(),
  });
}
