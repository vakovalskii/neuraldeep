import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SubmitForm from "./SubmitForm";

export const metadata = {
  title: "Добавить навык",
  description: "Опубликуйте свой навык в каталоге NeuralDeep",
};

export default async function SubmitPage() {
  const session = await auth();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Добавить навык</h1>
        <p className="text-gray-500 mb-8">
          Опубликуйте свой навык, чтобы другие разработчики могли его использовать.
        </p>

        {!session ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
            <p className="text-gray-400 mb-4">
              Для добавления навыка необходимо войти через GitHub
            </p>
            <a
              href="/api/auth/signin"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              Войти через GitHub
            </a>
          </div>
        ) : (
          <SubmitForm />
        )}
      </main>
    </>
  );
}
