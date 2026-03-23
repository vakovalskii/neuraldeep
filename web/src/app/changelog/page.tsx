import Header from "@/components/Header";

export const metadata = {
  title: "Обновления",
  description: "История изменений skillsbd",
};

export default function ChangelogPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Обновления</h1>

        <div className="flex flex-col gap-8">
          <article className="relative pl-6 border-l border-gray-800">
            <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-accent" />
            <time className="text-sm text-gray-600">23 марта 2026</time>
            <h2 className="text-lg font-semibold mt-1">Запуск skillsbd v0.1.0</h2>
            <ul className="mt-3 space-y-1.5 text-gray-400 text-sm">
              <li>Каталог навыков с поиском и рейтингом</li>
              <li>CLI: <code className="text-accent bg-gray-900 px-1 rounded">npx skillsbd add</code></li>
              <li>Авторизация через GitHub</li>
              <li>Добавление навыков через форму</li>
              <li>PostgreSQL для хранения данных</li>
              <li>Автодеплой через GitHub Actions</li>
            </ul>
          </article>
        </div>
      </main>
    </>
  );
}
