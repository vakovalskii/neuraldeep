import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Мои навыки",
  description: "Управление вашими навыками и MCP серверами",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Мои навыки</h1>
            <p className="text-gray-500 mt-1">Управляйте своими публикациями</p>
          </div>
          <a
            href="/submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            + Добавить
          </a>
        </div>
        <DashboardContent />
      </main>
    </>
  );
}
