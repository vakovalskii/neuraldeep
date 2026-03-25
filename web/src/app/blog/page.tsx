import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Блог",
  description: "Статьи о навыках для AI-агентов, обзоры и гайды от NeuralDeep",
};

const posts = [
  {
    title: "Claude Code Skills — полный гайд по навыкам",
    desc: "Что такое skills, как их устанавливать и какие навыки доступны для Claude Code.",
    href: "/claude-code-skills",
    date: "23 марта 2026",
  },
  {
    title: "Как использовать Claude Code в России",
    desc: "Навыки для российских сервисов: Яндекс Wordstat, Вебмастер, Метрика и другие.",
    href: "/claude-code-russia",
    date: "23 марта 2026",
  },
  {
    title: "AI агенты для программирования в 2026",
    desc: "Обзор популярных AI-агентов: Claude Code, Cursor, Copilot, Windsurf и как навыки усиливают их.",
    href: "/ai-agents",
    date: "23 марта 2026",
  },
  {
    title: "Навыки для Cursor AI",
    desc: "Как расширить Cursor с помощью навыков из NeuralDeep. Установка, настройка, примеры.",
    href: "/cursor-ai-skills",
    date: "23 марта 2026",
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Блог</h1>
        <p className="text-gray-500 mb-8">Статьи, гайды и обзоры о навыках для AI-агентов.</p>

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="block rounded-lg border border-gray-800 bg-gray-900 p-5 hover:border-gray-700 transition-colors"
            >
              <time className="text-xs text-gray-600">{post.date}</time>
              <h2 className="text-lg font-medium mt-1">{post.title}</h2>
              <p className="text-sm text-gray-500 mt-2">{post.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Подписывайтесь на{" "}
            <a
              href="https://t.me/neuraldeep"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Telegram-канал
            </a>{" "}
            чтобы не пропустить новые статьи
          </p>
        </div>
      </main>
    </>
  );
}
