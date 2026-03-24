"use client";

import { useState, useMemo, useEffect, useRef } from "react";

interface McpServer {
  name: string;
  desc: string;
  author: string;
  stars: number;
  license: string;
  url: string;
  install: string;
  category: string;
  tags: string[];
}

const servers: McpServer[] = [
  {
    name: "Playwright MCP",
    desc: "Управление браузером через MCP. Навигация, клики, скриншоты, заполнение форм для AI-агентов.",
    author: "Microsoft",
    stars: 0,
    license: "Apache-2.0",
    url: "https://github.com/anthropics/mcp-playwright",
    install: "npx @anthropic-ai/mcp-playwright",
    category: "Браузер",
    tags: ["playwright", "браузер", "автоматизация", "тестирование"],
  },
  {
    name: "Filesystem MCP",
    desc: "Безопасный доступ к файловой системе через MCP. Чтение, запись, поиск файлов с контролем доступа.",
    author: "Anthropic",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-filesystem",
    install: "npx @anthropic-ai/mcp-filesystem",
    category: "Файлы",
    tags: ["файлы", "filesystem", "чтение", "запись"],
  },
  {
    name: "PostgreSQL MCP",
    desc: "Подключение AI-агента к PostgreSQL. Запросы, схема, миграции через Model Context Protocol.",
    author: "Community",
    stars: 0,
    license: "MIT",
    url: "https://github.com/benborge/mcp-server-postgres",
    install: "npx mcp-server-postgres",
    category: "Базы данных",
    tags: ["postgresql", "sql", "база данных", "запросы"],
  },
  {
    name: "SQLite MCP",
    desc: "MCP сервер для SQLite. Лёгкая БД для локальных проектов и прототипов.",
    author: "Community",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-sqlite",
    install: "npx @anthropic-ai/mcp-sqlite",
    category: "Базы данных",
    tags: ["sqlite", "sql", "лёгкая", "локальная"],
  },
  {
    name: "GitHub MCP",
    desc: "Работа с GitHub через MCP: репозитории, issues, PR, код. Полный доступ к GitHub API.",
    author: "Anthropic",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-github",
    install: "npx @anthropic-ai/mcp-github",
    category: "API интеграции",
    tags: ["github", "git", "issues", "pr", "api"],
  },
  {
    name: "Slack MCP",
    desc: "Подключение AI-агента к Slack. Чтение каналов, отправка сообщений, поиск по истории.",
    author: "Community",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-slack",
    install: "npx @anthropic-ai/mcp-slack",
    category: "API интеграции",
    tags: ["slack", "мессенджер", "сообщения", "каналы"],
  },
  {
    name: "Terraform MCP",
    desc: "HashiCorp Terraform через MCP. Управление инфраструктурой, планирование, применение конфигураций.",
    author: "HashiCorp",
    stars: 1288,
    license: "MPL-2.0",
    url: "https://github.com/hashicorp/terraform-mcp-server",
    install: "npx @hashicorp/terraform-mcp-server",
    category: "DevOps",
    tags: ["terraform", "iac", "инфраструктура", "hashicorp"],
  },
  {
    name: "Fetch MCP",
    desc: "HTTP запросы через MCP. Агент делает GET/POST к любым API, парсит ответы.",
    author: "Anthropic",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-fetch",
    install: "npx @anthropic-ai/mcp-fetch",
    category: "API интеграции",
    tags: ["http", "fetch", "api", "запросы"],
  },
  {
    name: "Memory MCP",
    desc: "Персистентная память для AI-агента через MCP. Хранение контекста между сессиями.",
    author: "Anthropic",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-memory",
    install: "npx @anthropic-ai/mcp-memory",
    category: "Утилиты",
    tags: ["память", "контекст", "персистентность", "сессии"],
  },
  {
    name: "Puppeteer MCP",
    desc: "Headless Chrome через MCP. Скрапинг, скриншоты, PDF генерация для AI-агентов.",
    author: "Community",
    stars: 0,
    license: "MIT",
    url: "https://github.com/anthropics/mcp-puppeteer",
    install: "npx @anthropic-ai/mcp-puppeteer",
    category: "Браузер",
    tags: ["puppeteer", "chrome", "скрапинг", "pdf"],
  },
];

export default function McpGrid() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(servers.map((s) => s.category));
    return Array.from(cats).sort();
  }, []);

  const filtered = useMemo(() => {
    let list = servers;
    if (activeCategory) list = list.filter((s) => s.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.desc.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, activeCategory]);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          placeholder="Поиск MCP серверов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-foreground placeholder:text-gray-600 outline-none focus:border-gray-600 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory("")}
          className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
            !activeCategory
              ? "bg-accent/15 text-accent border border-accent/30"
              : "border border-gray-800 text-gray-500 hover:text-gray-400"
          }`}
        >
          Все ({servers.length})
        </button>
        {categories.map((cat) => {
          const count = servers.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? "" : cat)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                activeCategory === cat
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "border border-gray-800 text-gray-500 hover:text-gray-400"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filtered.map((server) => (
          <a
            key={server.name}
            href={server.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 hover-glow card-shine transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {server.name}
              </h3>
              {server.stars > 0 && (
                <span className="text-xs text-yellow-500/70 font-mono">★{server.stars}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 flex-1 mb-3 line-clamp-3">{server.desc}</p>
            <div className="rounded-md bg-gray-950 border border-gray-800 px-2 py-1.5 mb-3">
              <code className="text-[11px] text-accent break-all">{server.install}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-600">{server.author}</span>
              <span className="text-[10px] text-gray-700">{server.license}</span>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-600 py-8">MCP серверы не найдены</p>
      )}
    </div>
  );
}
