import Header from "@/components/Header";
import ToolsGrid from "./ToolsGrid";
import { Suspense } from "react";

export const metadata = {
  title: "Экосистема — Skills, MCP серверы, CLI инструменты",
  description:
    "Три слоя для AI-агентов: Skills (знания), MCP серверы (данные), CLI (действия). Open source каталог.",
  keywords: [
    "skills",
    "mcp server",
    "cli tools",
    "ai agents",
    "open source",
  ],
};

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">CLI инструменты</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Три слоя для AI-агентов: навыки дают знания, MCP серверы — доступ к данным,
          CLI инструменты — действия.
        </p>
        <Suspense>
          <ToolsGrid />
        </Suspense>
      </main>
    </>
  );
}
