"use client";

import { useState, useMemo } from "react";
import { skills, formatInstalls, type Skill, type SkillType } from "@/data/skills";

type SortMode = "all" | "trending" | "hot" | "newest";
type FilterType = "all" | "skill" | "mcp";

function getTotalInstalls(list: Skill[]): number {
  return list.reduce((sum, s) => sum + s.installs, 0);
}

function getTotalTrending(list: Skill[]): number {
  return list.reduce((sum, s) => sum + s.trending24h, 0);
}

function TypeBadge({ type }: { type: SkillType }) {
  if (type === "mcp") {
    return (
      <span className="inline-flex shrink-0 items-center rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-400">
        MCP
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
      Skill
    </span>
  );
}

function NewBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 animate-pulse">
      New
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export default function Leaderboard() {
  const [sortMode, setSortMode] = useState<SortMode>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...skills];

    if (filterType !== "all") {
      list = list.filter((s) => s.type === filterType);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.owner.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortMode) {
      case "newest":
        list.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        break;
      case "trending":
        list.sort((a, b) => b.trending24h - a.trending24h);
        break;
      case "hot": {
        // ratio of trending to total, but safely handle 0 installs
        list.sort((a, b) => {
          const ratioA = a.installs > 0 ? a.trending24h / a.installs : 0;
          const ratioB = b.installs > 0 ? b.trending24h / b.installs : 0;
          return ratioB - ratioA;
        });
        break;
      }
      default:
        // "all" = purely by installs, no isNew override
        list.sort((a, b) => b.installs - a.installs);
    }

    return list;
  }, [sortMode, filterType, search]);

  const skillCount = skills.filter((s) => s.type === "skill").length;
  const mcpCount = skills.filter((s) => s.type === "mcp").length;
  const newCount = skills.filter((s) => s.isNew).length;

  // Right column value depends on sort mode
  function rightColumnValue(skill: Skill): string {
    switch (sortMode) {
      case "trending":
        return `+${formatInstalls(skill.trending24h)}`;
      case "newest":
        return formatDate(skill.addedAt);
      default:
        return formatInstalls(skill.installs);
    }
  }

  function rightColumnLabel(): string {
    switch (sortMode) {
      case "trending":
        return "За 24ч";
      case "newest":
        return "Добавлен";
      default:
        return "Установки";
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск навыков и MCP-серверов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-foreground placeholder:text-gray-600 outline-none focus:border-gray-600 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500">
          /
        </kbd>
      </div>

      {/* Type filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            filterType === "all"
              ? "bg-gray-800 text-foreground"
              : "text-gray-500 hover:text-gray-400"
          }`}
        >
          Все <span className="text-gray-600">{skills.length}</span>
        </button>
        <button
          onClick={() => setFilterType("skill")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            filterType === "skill"
              ? "bg-accent/10 border border-accent/30 text-accent"
              : "text-gray-500 hover:text-gray-400"
          }`}
        >
          Skill <span className="text-gray-600">{skillCount}</span>
        </button>
        <button
          onClick={() => setFilterType("mcp")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            filterType === "mcp"
              ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
              : "text-gray-500 hover:text-gray-400"
          }`}
        >
          MCP <span className="text-gray-600">{mcpCount}</span>
        </button>
        {newCount > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
            +{newCount} новых
          </span>
        )}
      </div>

      {/* Sort tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-800">
        {([
          { key: "all" as const, label: "За все время", extra: formatInstalls(getTotalInstalls(skills)) },
          { key: "newest" as const, label: "Новые", extra: null },
          { key: "trending" as const, label: "Тренды 24ч", extra: formatInstalls(getTotalTrending(skills)) },
          { key: "hot" as const, label: "Горячее", extra: null },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSortMode(tab.key)}
            className={`whitespace-nowrap px-3 py-2 text-sm transition-colors border-b-2 ${
              sortMode === tab.key
                ? "border-accent text-foreground"
                : "border-transparent text-gray-500 hover:text-gray-400"
            }`}
          >
            {tab.label}
            {tab.extra && (
              <span className="text-gray-600"> ({tab.extra})</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_80px] gap-2 px-2 py-2 text-xs text-gray-600">
          <span>#</span>
          <span>Навык</span>
          <span className="text-right">{rightColumnLabel()}</span>
        </div>

        {/* Rows */}
        {filtered.map((skill, i) => (
          <div
            key={skill.id}
            className={`group grid grid-cols-[40px_1fr_80px] gap-2 rounded-lg px-2 py-3 transition-colors hover:bg-gray-900 cursor-pointer items-center ${
              skill.isNew ? "ring-1 ring-emerald-500/20 bg-emerald-500/5" : ""
            }`}
          >
            <span className="text-sm text-gray-600">{i + 1}</span>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground truncate">
                  {skill.name}
                </span>
                <TypeBadge type={skill.type} />
                {skill.isNew && <NewBadge />}
              </div>
              <span className="text-xs text-gray-600 font-mono truncate">
                {skill.owner}/{skill.repo}
              </span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-800/50 px-1.5 py-0.5 text-[10px] text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-400 text-right font-mono whitespace-nowrap">
              {rightColumnValue(skill)}
            </span>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-600">
            Навыки не найдены
          </div>
        )}
      </div>
    </div>
  );
}
