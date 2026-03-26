import Header from "@/components/Header";
import McpGrid from "./McpGrid";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { mcpServers, type McpServer } from "@/data/mcp-servers";
import { toSlug } from "@/data/skills";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "MCP серверы для AI-агентов | NeuralDeep",
  description:
    "Каталог MCP серверов: ВкусВилл, Яндекс Tracker, GigaChat, Kubernetes, Docker, PostgreSQL и другие. Подключите AI-агента к данным через Model Context Protocol.",
  openGraph: {
    title: "MCP серверы — NeuralDeep",
    description: "Каталог MCP серверов для AI-агентов. Российские и глобальные серверы.",
    url: "https://neuraldeep.ru/mcp",
  },
  twitter: {
    card: "summary" as const,
    title: "MCP серверы — NeuralDeep",
    description: "Каталог MCP серверов для AI-агентов",
  },
  keywords: [
    "mcp server",
    "model context protocol",
    "claude mcp",
    "mcp tools",
    "mcp российские",
  ],
};

export default async function McpPage() {
  const dbMcp = await prisma.skill.findMany({
    where: { status: "approved", type: "mcp" },
    orderBy: { installs: "desc" },
  });

  const dbAsStatic: McpServer[] = dbMcp.map((s) => ({
    name: s.name,
    slug: toSlug(s.name),
    desc: s.description,
    author: s.authorName || s.owner,
    stars: s.githubStars,
    license: "Open",
    url: `https://github.com/${s.owner}/${s.repo}`,
    install: `npx skillsbd add ${s.owner}/${s.repo}/${s.name}`,
    category: s.category,
    tags: s.tags,
  }));

  const allServers = [...dbAsStatic, ...mcpServers];

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-3xl font-bold">MCP серверы</h1>
          <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">Model Context Protocol</span>
        </div>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          MCP серверы дают агентам доступ к данным и инструментам: базы данных,
          API, файловые системы, браузеры и другие ресурсы.
        </p>
        <Suspense>
          <McpGrid servers={allServers} />
        </Suspense>
      </main>
    </>
  );
}
