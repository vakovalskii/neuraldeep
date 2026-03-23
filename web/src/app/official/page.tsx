import Header from "@/components/Header";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Официальные навыки",
  description: "Проверенные навыки от команды skillsbd",
};

export default async function OfficialPage() {
  const skills = await prisma.skill.findMany({
    where: { owner: "skillsbd" },
    orderBy: { installs: "desc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Официальные навыки</h1>
        <p className="text-gray-500 mb-8">
          Проверенные и поддерживаемые навыки от команды skillsbd.
        </p>

        {skills.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">Скоро здесь появятся официальные навыки</p>
            <p className="text-gray-600 text-sm">Мы работаем над первым набором навыков</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{skill.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{skill.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-gray-600 font-mono">{skill.owner}/{skill.repo}</span>
                      <span className="text-xs text-gray-600">{skill.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
