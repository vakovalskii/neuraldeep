import Header from "@/components/Header";

export const metadata = {
  title: "Условия использования",
  description: "Условия использования сервиса NeuralDeep",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Условия использования</h1>

        <div className="flex flex-col gap-6 text-gray-400 text-sm leading-relaxed">
          <p>Дата вступления в силу: 23 марта 2026 г.</p>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Общие положения</h2>
            <p>
              NeuralDeep — агрегатор навыков и инструментов для AI-агентов. Используя сервис, вы
              принимаете данные условия.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Контент</h2>
            <p>
              Навыки публикуются пользователями. Авторы несут ответственность за содержание
              своих навыков. Мы оставляем за собой право удалять контент, нарушающий правила.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Лицензия</h2>
            <p>
              Навыки, опубликованные в каталоге, распространяются под лицензией, указанной
              автором в репозитории. При отсутствии лицензии навык считается общедоступным.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Ограничение ответственности</h2>
            <p>
              Сервис предоставляется «как есть». Мы не несём ответственности за ущерб,
              вызванный использованием навыков из каталога.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Изменения</h2>
            <p>
              Мы можем обновлять данные условия. Актуальная версия всегда доступна на этой странице.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
