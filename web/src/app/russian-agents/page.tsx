import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Российские AI-агенты для программирования — GigaCode, Koda, SourceCraft",
  description:
    "Обзор российских AI-кодинг агентов: GigaCode (Сбер), Koda, SourceCraft (Яндекс), Kodify (МТС), Veai, Amvera Polide. Совместимость с навыками skillsbd.",
  keywords: [
    "GigaCode",
    "Koda",
    "SourceCraft",
    "Kodify",
    "Veai",
    "Amvera Polide",
    "российские AI агенты",
    "кодовый агент россия",
    "AI помощник программиста",
    "GigaIDE",
  ],
};

const agents = [
  {
    name: "GigaCode 2.0",
    company: "Сбер",
    desc: "AI-ассистент с агент-режимом. 35+ языков, 40 подсказок/сек. Агент анализирует проект, пишет код, запускает тесты, создаёт коммиты.",
    ide: "VS Code, JetBrains, GigaIDE, Jupyter",
    users: "25 000+ MAU",
    url: "https://gitverse.ru",
    compat: "planned",
  },
  {
    name: "GigaIDE Pro",
    company: "Сбер",
    desc: "Полноценная IDE на базе IntelliJ — российская альтернатива JetBrains. Встроенная мультиагентная система GigaCode.",
    ide: "Standalone IDE",
    users: "",
    url: "https://gitverse.ru/features/gigaide/",
    compat: "planned",
  },
  {
    name: "SourceCraft Code Assistant",
    company: "Яндекс",
    desc: "AI-ассистент и агент: автокомплит, чат, генерация кода + полный цикл разработки (репо, тесты, PR, деплой в Yandex Cloud). 30+ языков.",
    ide: "VS Code, VSCodium, JetBrains",
    users: "50%+ разработчиков Яндекса",
    url: "https://sourcecraft.dev/portal/code-assistant/",
    compat: "planned",
  },
  {
    name: "Koda",
    company: "KODA (ex-Sber)",
    desc: "AI-помощник с агент-режимом и CLI. BYOK: Claude, Gemini, Mistral. Бесплатный тариф. Обрабатывает ~1B токенов/день.",
    ide: "VS Code, JetBrains, GigaIDE, CLI",
    users: "3 000+ MAU",
    url: "https://kodacode.ru",
    compat: "likely",
  },
  {
    name: "Kodify 2",
    company: "МТС AI",
    desc: "AI-ассистент для 90 языков. On-premise для корпораций. Генерация тестов, документации, оптимизация кода.",
    ide: "VS Code, JetBrains",
    users: "",
    url: "https://mts.ai/ru/product/kodify/",
    compat: "planned",
  },
  {
    name: "Veai",
    company: "Veai (ex-JetBrains)",
    desc: "7 специализированных агентов: код, тесты, ревью, документация, дебаг, оптимизация. Привлекли 400М ₽ инвестиций.",
    ide: "IntelliJ IDEA",
    users: "20+ крупных компаний",
    url: "https://veai.ru",
    compat: "planned",
  },
  {
    name: "Cloud.ru AI Coder",
    company: "Cloud.ru",
    desc: "Облачный AI-ассистент. Интегрируется через Continue.dev, Aider, Roo Code. Поддержка GigaChat, Mistral, DeepSeek.",
    ide: "VS Code (через плагины)",
    users: "",
    url: "https://cloud.ru/solutions/ai-assistent-razrabotchika",
    compat: "possible",
  },
  {
    name: "Amvera Polide",
    company: "Amvera Cloud",
    desc: "Онлайн IDE на базе VS Code — российский Cursor. Деплой в облако одним кликом. Claude, GPT, Gemini, DeepSeek.",
    ide: "Браузер (VS Code)",
    users: "",
    url: "https://amvera.ru/polide",
    compat: "possible",
  },
];

const compatLabels: Record<string, { text: string; style: string }> = {
  likely: { text: "Совместим", style: "bg-green-900/30 text-green-400 border-green-800/50" },
  possible: { text: "Возможно", style: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50" },
  planned: { text: "В планах", style: "bg-gray-900 text-gray-500 border-gray-800" },
};

export default function RussianAgentsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Российские AI-агенты для программирования
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl">
          Обзор российских инструментов для AI-кодинга и их совместимость с навыками skillsbd.
        </p>

        <div className="flex flex-col gap-4 mb-10">
          {agents.map((a) => {
            const compat = compatLabels[a.compat];
            return (
              <div
                key={a.name}
                className="rounded-lg border border-gray-800 bg-gray-900 p-5 hover:border-gray-700 hover-glow transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-lg">{a.name}</h2>
                      <span className="text-xs text-gray-600">{a.company}</span>
                      <span className={`rounded border px-1.5 py-0.5 text-[10px] ${compat.style}`}>
                        {compat.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{a.desc}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
                      <span>IDE: {a.ide}</span>
                      {a.users && <span>{a.users}</span>}
                    </div>
                  </div>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-md border border-gray-800 px-3 py-1.5 text-xs text-gray-400 hover:border-gray-600 hover:text-foreground transition-colors"
                  >
                    Сайт →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
          <h2 className="text-lg font-semibold mb-3">Совместимость с навыками</h2>
          <p className="text-sm text-gray-400 mb-3">
            Навыки из skillsbd работают с любым агентом, который читает файлы проекта.
            Формат SKILL.md — это текстовые инструкции в директории <code className="text-accent bg-gray-900 px-1 rounded">.skills/</code>.
          </p>
          <p className="text-sm text-gray-400">
            <strong className="text-foreground">Koda</strong> — наиболее совместим (есть CLI + BYOK).{" "}
            <strong className="text-foreground">Cloud.ru</strong> и <strong className="text-foreground">Amvera Polide</strong> — используют
            open-source инструменты (Continue.dev, Aider), которые можно расширить навыками.
          </p>
        </div>

        <div className="flex gap-3 mt-8">
          <Link
            href="/"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Каталог навыков
          </Link>
          <Link
            href="/ai-agents"
            className="rounded-md border border-gray-800 px-4 py-2 text-sm text-foreground hover:border-gray-600 transition-colors"
          >
            Глобальные агенты
          </Link>
        </div>
      </main>
    </>
  );
}
