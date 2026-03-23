"use client";

import { useState } from "react";

export default function SubmitForm() {
  const [submitted, setSubmitted] = useState(false);

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
    return (
      <div className="rounded-lg border border-green-800 bg-green-900/20 p-8 text-center">
        <p className="text-green-400 text-lg font-medium mb-2">Навык отправлен на модерацию</p>
        <p className="text-gray-500">Мы проверим его и добавим в каталог.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Название навыка *</span>
          <input
            name="name"
            required
            placeholder="my-awesome-skill"
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
            <option value="фронтенд">Фронтенд</option>
            <option value="бэкенд">Бэкенд</option>
            <option value="девопс">Девопс</option>
            <option value="утилиты">Утилиты</option>
            <option value="тестирование">Тестирование</option>
            <option value="безопасность">Безопасность</option>
            <option value="дизайн">Дизайн</option>
            <option value="контент">Контент</option>
            <option value="мобильные">Мобильные</option>
            <option value="фреймворки">Фреймворки</option>
            <option value="языки">Языки</option>
            <option value="стили">Стили</option>
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
        Отправить на модерацию
      </button>
    </form>
  );
}
