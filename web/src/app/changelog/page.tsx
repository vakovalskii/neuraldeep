import Header from "@/components/Header";

export const metadata = {
  title: "Обновления",
  description: "История изменений skillsbd",
};

const changelog = [
  {
    date: "24 марта 2026",
    version: "v0.4.0",
    title: "Slug URL, markdown таблицы, очистка диска",
    items: [
      "URL навыков теперь человекочитаемые: /skill/yandex-wordstat вместо /skill/cuid",
      "Markdown: таблицы рендерятся корректно (remark-gfm)",
      "Автоочистка Docker build cache (41 GB утечка устранена)",
      "Комментарии: новые внизу, форма под списком",
      "Навыки с пробелами в имени корректно обрабатываются",
    ],
  },
  {
    date: "23 марта 2026",
    version: "v0.3.0",
    title: "Админ-панель, аудит, комментарии",
    items: [
      "Полная админ-панель: навыки, пользователи, модерация, импорт из GitHub",
      "Импорт репозитория: вставь URL → парсер находит все навыки",
      "Система комментариев на карточках навыков",
      "Аудит безопасности: 5 проверок (репо, лицензия, активность, автор, безопасность)",
      "Ежечасный cron: аудит + синхронизация GitHub звёзд",
      "Модерация: новые навыки идут в pending → одобрение админом",
      "Кнопка ★/☆ в админке для «Выбор редакции»",
    ],
  },
  {
    date: "23 марта 2026",
    version: "v0.2.0",
    title: "SEO, мобилка, конкурентный анализ",
    items: [
      "SEO-страницы по запросам из Вордстата: Claude Code Skills, Cursor AI, AI агенты",
      "Мобильная адаптация: бургер-меню, адаптивные гриды",
      "Cmd+K / «/» — горячие клавиши для поиска",
      "Фильтр по категориям (динамические чипы)",
      "ZIP-скачивание навыка рядом с CLI командой",
      "GitHub звёзды ★ в лидерборде и на карточках",
      "Сортировка: по установкам, трендам, звёздам, дате",
      "Открытая API документация: /docs/api",
    ],
  },
  {
    date: "23 марта 2026",
    version: "v0.1.0",
    title: "Запуск skillsБД",
    items: [
      "Каталог навыков с поиском и рейтингом",
      "CLI: npx skillsbd add/search/list/remove",
      "Авторизация через GitHub OAuth",
      "Добавление навыков через форму с модерацией",
      "PostgreSQL + Prisma ORM",
      "Traefik v3 + Let's Encrypt TLS",
      "Автодеплой через GitHub Actions (push to main → deploy)",
      "Cloudflare DNS для skillsbd.ru",
      "Навыки Polyakov: Яндекс Wordstat, Вебмастер, Метрика и другие",
      "Навык для 1С:Предприятие (65 скиллов, 183 ★)",
      "Навык для Битрикс24",
      "Sitemap.xml + robots.txt",
      "Верификация в Яндекс Вебмастер и Google Search Console",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Обновления</h1>

        <div className="flex flex-col gap-10">
          {changelog.map((entry) => (
            <article key={entry.version} className="relative pl-6 border-l border-gray-800">
              <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-accent" />
              <div className="flex items-center gap-3">
                <time className="text-sm text-gray-600">{entry.date}</time>
                <span className="rounded bg-gray-900 border border-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-500">
                  {entry.version}
                </span>
              </div>
              <h2 className="text-lg font-semibold mt-1">{entry.title}</h2>
              <ul className="mt-3 space-y-1.5 text-gray-400 text-sm">
                {entry.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
