import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ghHeaders: Record<string, string> = {
  "User-Agent": "skillsbd",
  Accept: "application/vnd.github+json",
};
if (process.env.GITHUB_TOKEN) {
  ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, owner, repo, description, category, authorName, telegramLink } = body;

  if (!name || !owner || !repo || !description || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate owner — strip URLs if pasted full GitHub link
  const cleanOwner = owner.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
  const cleanRepo = repo.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");

  // Fetch GitHub stars automatically
  let githubStars = 0;
  try {
    const ghRes = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}`, { headers: ghHeaders });
    if (ghRes.ok) {
      const ghData = await ghRes.json();
      githubStars = ghData.stargazers_count || 0;
    }
  } catch {}

  const skill = await prisma.skill.create({
    data: {
      name,
      owner: cleanOwner,
      repo: cleanRepo,
      description,
      category,
      authorName: authorName || null,
      telegramLink: telegramLink || null,
      authorId: session.user.id,
      status: "pending",
      githubStars,
    },
  });

  // Auto-run audit in background (fire and forget)
  fetch(`${process.env.NEXTAUTH_URL || "https://neuraldeep.ru"}/api/skills/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skillId: skill.id }),
  }).catch(() => {});

  return NextResponse.json({ ...skill, message: "Навык отправлен на модерацию" }, { status: 201 });
}
