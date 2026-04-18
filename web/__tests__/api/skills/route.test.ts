import { describe, it, expect } from "vitest";
import { prisma } from "../../mocks/prisma";
import { makeRequest } from "../../helpers/request";
import { GET } from "@/app/api/skills/route";

describe("GET /api/skills", () => {
  it("returns approved skills sorted by installs", async () => {
    const mockSkills = [
      { id: "1", name: "skill-a", installs: 100, status: "approved" },
    ];
    prisma.skill.findMany.mockResolvedValue(mockSkills);

    const req = makeRequest("https://skillsbd.ru/api/skills");
    const res = await GET(req);
    const data = await res.json();

    expect(data).toEqual(mockSkills);
    expect(prisma.skill.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { installs: "desc" },
        take: 100,
      })
    );
  });

  it("sorts by trending when ?sort=trending", async () => {
    prisma.skill.findMany.mockResolvedValue([]);

    const req = makeRequest("https://skillsbd.ru/api/skills?sort=trending");
    await GET(req);

    expect(prisma.skill.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { trending24h: "desc" },
      })
    );
  });

  it("filters by search query via raw SQL", async () => {
    prisma.$queryRawUnsafe.mockResolvedValue([]);

    const req = makeRequest("https://skillsbd.ru/api/skills?q=yandex");
    const res = await GET(req);
    const data = await res.json();

    expect(prisma.$queryRawUnsafe).toHaveBeenCalled();
    expect(data).toEqual([]);
  });

  it("returns empty array when no skills", async () => {
    prisma.skill.findMany.mockResolvedValue([]);

    const req = makeRequest("https://skillsbd.ru/api/skills");
    const res = await GET(req);
    const data = await res.json();

    expect(data).toEqual([]);
  });
});
