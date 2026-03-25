export default function Hero() {
  const globalAgents = [
    "Claude Code",
    "Cursor",
    "Copilot",
    "Windsurf",
    "Cline",
    "Codex",
    "Gemini",
    "Roo",
    "Goose",
    "OpenCode",
    "Trae",
  ];

  const russianAgents = [
    "GigaCode",
    "Koda",
    "SourceCraft",
    "Kodify",
    "Amvera Polide",
  ];

  return (
    <div className="flex flex-col gap-4 py-6 sm:gap-6 sm:py-8 lg:py-12 animate-fade-in">
      <div className="flex items-baseline gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Neural<span className="text-accent">Deep</span>
        </h1>
        <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
          beta
        </span>
        <a
          href="https://github.com/vakovalskii/skillsbd"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-gray-900 border border-gray-800 px-2 py-0.5 text-[10px] text-gray-500 hover:text-gray-400 transition-colors"
        >
          open source
        </a>
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
        Агрегатор навыков, MCP серверов и AI-инструментов
      </p>

      <p className="max-w-md text-[15px] leading-relaxed text-gray-400 lg:text-base">
        Навыки, MCP серверы, CLI инструменты для AI-агентов.
        Яндекс, Битрикс, 1С, GigaChat и другие российские сервисы.
      </p>

      <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 font-mono text-sm w-fit card-shine">
        <span className="text-gray-500">$</span>
        <span className="text-foreground">
          npx skillsbd add <span className="text-gray-500">&lt;owner/repo&gt;</span>
        </span>
      </div>

      <div className="mt-2">
        <p className="mb-2 text-xs text-gray-600">Глобальные агенты:</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {globalAgents.map((agent) => (
            <span
              key={agent}
              className="rounded-md border border-gray-800 bg-gray-900 px-2 py-0.5 text-xs text-gray-400"
            >
              {agent}
            </span>
          ))}
        </div>
        <p className="mb-2 text-xs text-gray-600">Российские агенты:</p>
        <div className="flex flex-wrap gap-1.5">
          {russianAgents.map((agent) => (
            <span
              key={agent}
              className="rounded-md border border-accent/20 bg-accent/5 px-2 py-0.5 text-xs text-accent/80"
            >
              {agent}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
