import { prisma } from "./db";
import { toSlug } from "@/data/skills";
import { mcpServers } from "@/data/mcp-servers";
import { cliTools } from "@/data/cli-tools";

let cachedPrompt: string | null = null;
let cachedAt = 0;
const TTL = 5 * 60 * 1000;

export async function buildSystemPrompt(): Promise<string> {
  if (cachedPrompt && Date.now() - cachedAt < TTL) return cachedPrompt;

  const skills = await prisma.skill.findMany({
    where: { status: "approved", type: "skill" },
    orderBy: { installs: "desc" },
  });

  const dbMcpServers = await prisma.skill.findMany({
    where: { status: "approved", type: "mcp" },
    orderBy: { installs: "desc" },
  });

  const skillsBlock = skills
    .map(
      (s) =>
        `- "${s.name}" (${s.owner}/${s.repo}) — ${s.description}. ` +
        `Категория: ${s.category}. ★${s.githubStars}. ` +
        `Установка: npx skillsbd add ${s.owner}/${s.repo}/${s.name}. ` +
        `Страница: https://neuraldeep.ru/skill/${toSlug(s.name)}`
    )
    .join("\n");

  const dbMcpBlock = dbMcpServers
    .map(
      (s) =>
        `- "${s.name}" (${s.owner}/${s.repo}) — ${s.description}. ` +
        `Категория: ${s.category}. ★${s.githubStars}. ` +
        `Страница: https://neuraldeep.ru/mcp/${toSlug(s.name)}`
    )
    .join("\n");

  const staticMcpBlock = mcpServers
    .map(
      (m) =>
        `- "${m.name}" — ${m.desc}. ` +
        `Категория: ${m.category}. ${m.stars > 0 ? `★${m.stars}` : ""}. ` +
        `Подключение: ${m.install}. ` +
        `Страница: https://neuraldeep.ru/mcp/${m.slug}`
    )
    .join("\n");

  const mcpBlock = [dbMcpBlock, staticMcpBlock].filter(Boolean).join("\n");

  const toolsBlock = cliTools
    .map(
      (t) =>
        `- "${t.name}" — ${t.desc}. ★${t.stars}. ` +
        `Установка: ${t.install}`
    )
    .join("\n");

  const prompt = `Ты — AI-помощник сайта NeuralDeep.ru.
NeuralDeep — российский агрегатор навыков (skills), MCP серверов и CLI инструментов для AI-агентов.
Фокус на российские сервисы: Яндекс, Битрикс, 1С, GigaChat, Wildberries, ВкусВилл.

Твоя задача:
1. Понять задачу/потребность пользователя
2. Подобрать подходящие навыки, MCP серверы и CLI инструменты
3. Дать ссылки на страницы neuraldeep.ru
4. Показать команды установки (npx skillsbd add ...)
5. Предложить комбинации для комплексных задач

Правила:
- Отвечай на русском
- Будь кратким и полезным
- Используй markdown
- Давай конкретные ссылки и команды
- Если нет подходящего — скажи честно и предложи добавить через neuraldeep.ru/submit

=== НАВЫКИ (${skills.length} шт) ===
${skillsBlock}

=== MCP СЕРВЕРЫ (${dbMcpServers.length + mcpServers.length} шт) ===
${mcpBlock}

=== CLI ИНСТРУМЕНТЫ (${cliTools.length} шт) ===
${toolsBlock}`;

  cachedPrompt = prompt;
  cachedAt = Date.now();
  return prompt;
}
