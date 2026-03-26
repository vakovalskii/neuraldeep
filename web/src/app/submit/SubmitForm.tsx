"use client";

import { useState } from "react";

const skillCategories = [
  "фронтенд", "бэкенд", "девопс", "утилиты", "тестирование",
  "безопасность", "дизайн", "контент", "мобильные", "фреймворки", "языки", "стили",
];

const mcpCategories = [
  "Российские", "DevOps", "Браузер", "Базы данных", "API интеграции", "Утилиты",
];

export default function SubmitForm() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<"skill" | "mcp">("skill");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      owner: form.get("owner"),
      repo: form.get("repo"),
      description: form.get("description"),
      category: form.get("category"),
      authorName: form.get("authorName"),
      telegramLink: form.get("telegramLink"),
      type,
    };

    const res = await fetch("/api/skills/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    const label = type === "mcp" ? "MCP сервер" : "Навык";
    return (
      <div className="rounded-lg border border-green-800 bg-green-900/20 p-8 text-center">
        <p className="text-green-400 text-lg font-medium mb-2">{label} отправлен на модерацию</p>
        <p className="text-gray-500">Мы проверим и добавим в каталог.</p>
      </div>
    );
  }

  const categories = type === "mcp" ? mcpCategories : skillCategories;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("skill")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            type === "skill"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "border border-gray-800 text-gray-500 hover:text-gray-400"
          }`}
        >
          Навык (Skill)
        </button>
        <button
          type="button"
          onClick={() => setType("mcp")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            type === "mcp"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "border border-gray-800 text-gray-500 hover:text-gray-400"
          }`}
        >
          MCP сервер
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">
            {type === "mcp" ? "Название MCP сервера" : "Название навыка"} *
          </span>
          <input
            name="name"
            required
            placeholder={type === "mcp" ? "my-mcp-server" : "my-awesome-skill"}
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Категория *</span>
          <select
            name="category"
            required
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          >
            <option value="">Выберите...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Владелец (GitHub) *</span>
          <input
            name="owner"
            required
            placeholder="username"
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Репозиторий *</span>
          <input
            name="repo"
            required
            placeholder="my-skills-repo"
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-gray-400">Описание *</span>
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Кратко опишите, что делает ваш навык..."
          className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors resize-none"
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Ваше имя</span>
          <input
            name="authorName"
            placeholder="Имя автора"
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Telegram канал</span>
          <input
            name="telegramLink"
            placeholder="https://t.me/your_channel"
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-gray-600 transition-colors"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors w-fit"
      >
        Отправить {type === "mcp" ? "MCP сервер" : "навык"} на модерацию
      </button>
    </form>
  );
}
