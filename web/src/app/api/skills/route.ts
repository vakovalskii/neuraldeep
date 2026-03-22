import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "all";
  const q = searchParams.get("q") || "";

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
          { owner: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const orderBy =
    sort === "trending"
      ? { trending24h: "desc" as const }
      : { installs: "desc" as const };

  const skills = await prisma.skill.findMany({ where, orderBy, take: 100 });
  return NextResponse.json(skills);
}
