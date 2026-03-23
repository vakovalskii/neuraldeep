import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "skillsbd-cron-2026";

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await prisma.skill.findMany({ select: { id: true, name: true } });
  const results = [];

  for (const skill of skills) {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL || "https://skillsbd.ru"}/api/skills/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: skill.id }),
      });
      const data = await res.json();
      results.push({ skill: skill.name, ok: true, checks: Array.isArray(data) ? data.length : 0 });
    } catch (e) {
      results.push({ skill: skill.name, ok: false });
    }
  }

  return NextResponse.json({ audited: results.length, results });
}
