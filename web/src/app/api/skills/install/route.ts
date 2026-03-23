import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { name, owner, repo } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    // Ищем навык по имени, или по owner/repo/name
    const where = owner && repo
      ? { name, owner, repo }
      : { name };

    const skill = await prisma.skill.findFirst({ where });

    if (!skill) {
      // Навык не в каталоге — просто логируем, не ошибка
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
