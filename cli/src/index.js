#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { get } from "https";

const VERSION = "0.1.0";
const API_URL = "https://skillsbd.ru/api/skills";

const HELP = `
  skillsbd - CLI для установки навыков AI-агентов

  Использование:
    npx skillsbd add <owner/repo>           Установить все навыки из репозитория
    npx skillsbd add <owner/repo/skill>     Установить конкретный навык
    npx skillsbd list                       Показать установленные навыки
    npx skillsbd search <запрос>            Поиск навыков в каталоге
    npx skillsbd remove <skill>             Удалить навык
    npx skillsbd --help                     Показать справку
    npx skillsbd --version                  Показать версию

  Примеры:
    npx skillsbd add skillsbd/agent-skills
    npx skillsbd add skillsbd/agent-skills/react-best-practices
    npx skillsbd search react
    npx skillsbd list

  Каталог: https://skillsbd.ru
`;

const AGENTS_DIR = ".skills";

function log(msg) {
  console.log(`  \x1b[36m>\x1b[0m ${msg}`);
}

function success(msg) {
  console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
}

function error(msg) {
  console.error(`  \x1b[31m✗\x1b[0m ${msg}`);
}

function ensureSkillsDir() {
  const dir = resolve(process.cwd(), AGENTS_DIR);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function cloneSkill(ownerRepo, skillName) {
  const parts = ownerRepo.split("/");
  if (parts.length < 2) {
    error("Формат: owner/repo или owner/repo/skill-name");
    process.exit(1);
  }

  const owner = parts[0];
  const repo = parts[1];
  const skill = skillName || parts[2];
  const repoUrl = `https://github.com/${owner}/${repo}.git`;

  const skillsDir = ensureSkillsDir();
  const tempDir = join(skillsDir, ".tmp-clone");

  log(`Клонирование ${owner}/${repo}...`);

  try {
    execSync(`git clone --depth 1 ${repoUrl} "${tempDir}" 2>/dev/null`, {
      stdio: "pipe",
    });
  } catch {
    error(`Не удалось клонировать ${repoUrl}`);
    error("Проверьте, существует ли репозиторий и доступен ли он.");
    process.exit(1);
  }

  // Look for SKILL.md files
  const skillsPath = join(tempDir, "skills");
  if (!existsSync(skillsPath)) {
    // Try root-level SKILL.md
    const rootSkill = join(tempDir, "SKILL.md");
    if (existsSync(rootSkill)) {
      const destDir = join(skillsDir, repo);
      mkdirSync(destDir, { recursive: true });
      const content = readFileSync(rootSkill, "utf-8");
      writeFileSync(join(destDir, "SKILL.md"), content);
      success(`Установлен навык: ${repo}`);
    } else {
      error("Навыки не найдены в репозитории (нет директории skills/ или SKILL.md)");
    }
    cleanup(tempDir);
    return;
  }

  // Install specific or all skills
  try {
    const entries = execSync(`ls "${skillsPath}"`, { encoding: "utf-8" })
      .trim()
      .split("\n")
      .filter(Boolean);

    let installed = 0;

    for (const entry of entries) {
      if (skill && entry !== skill) continue;

      const skillMd = join(skillsPath, entry, "SKILL.md");
      if (existsSync(skillMd)) {
        const destDir = join(skillsDir, entry);
        mkdirSync(destDir, { recursive: true });

        // Copy all files from skill directory
        execSync(`cp -r "${join(skillsPath, entry)}/." "${destDir}/"`);
        success(`Установлен: ${entry}`);
        installed++;
      }
    }

    if (installed === 0) {
      error(skill ? `Навык "${skill}" не найден` : "Навыки не найдены");
    } else {
      log(`Установлено навыков: ${installed}`);
    }
  } catch (e) {
    error("Ошибка при установке навыков");
  }

  cleanup(tempDir);
}

function cleanup(dir) {
  try {
    execSync(`rm -rf "${dir}"`);
  } catch {}
}

function listSkills() {
  const dir = resolve(process.cwd(), AGENTS_DIR);
  if (!existsSync(dir)) {
    log("Навыки не установлены. Используйте: npx skillsbd add <owner/repo>");
    return;
  }

  try {
    const entries = execSync(`ls "${dir}"`, { encoding: "utf-8" })
      .trim()
      .split("\n")
      .filter((e) => e && !e.startsWith("."));

    if (entries.length === 0) {
      log("Навыки не установлены.");
      return;
    }

    console.log("\n  Установленные навыки:\n");
    for (const entry of entries) {
      const skillMd = join(dir, entry, "SKILL.md");
      if (existsSync(skillMd)) {
        const content = readFileSync(skillMd, "utf-8");
        const nameMatch = content.match(/name:\s*(.+)/);
        const descMatch = content.match(/description:\s*(.+)/);
        const name = nameMatch ? nameMatch[1].trim() : entry;
        const desc = descMatch ? descMatch[1].trim() : "";
        console.log(`  \x1b[36m${name}\x1b[0m`);
        if (desc) console.log(`    ${desc}`);
        console.log();
      } else {
        console.log(`  \x1b[36m${entry}\x1b[0m\n`);
      }
    }
  } catch {
    log("Навыки не установлены.");
  }
}

function removeSkill(name) {
  if (!name) {
    error("Укажите имя навыка: npx skillsbd remove <name>");
    process.exit(1);
  }

  const dir = join(resolve(process.cwd(), AGENTS_DIR), name);
  if (!existsSync(dir)) {
    error(`Навык "${name}" не найден`);
    process.exit(1);
  }

  execSync(`rm -rf "${dir}"`);
  success(`Удален: ${name}`);
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Не удалось разобрать ответ сервера"));
        }
      });
    }).on("error", reject);
  });
}

function formatInstalls(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

async function searchSkills(query) {
  if (!query) {
    error("Укажите запрос: npx skillsbd search <запрос>");
    process.exit(1);
  }

  log(`Поиск "${query}" в каталоге skillsbd...`);
  console.log();

  try {
    const results = await fetchJSON(`${API_URL}?q=${encodeURIComponent(query)}`);

    if (!results || results.length === 0) {
      log("Ничего не найдено. Попробуйте другой запрос.");
      log(`Каталог: https://skillsbd.ru`);
      return;
    }

    for (const r of results) {
      const author = r.authorName ? `  \x1b[33m${r.authorName}\x1b[0m` : "";
      console.log(
        `  \x1b[36m${r.name}\x1b[0m  \x1b[90m${r.owner}/${r.repo}\x1b[0m  ${formatInstalls(r.installs)} установок${author}`
      );
    }
    console.log();
    log(`Установка: npx skillsbd add <owner/repo>`);
  } catch {
    log("Не удалось подключиться к каталогу. Проверьте подключение к сети.");
    log(`Каталог: https://skillsbd.ru`);
  }
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
  console.log(HELP);
  process.exit(0);
}

if (command === "--version" || command === "-v") {
  console.log(`skillsbd v${VERSION}`);
  process.exit(0);
}

console.log();
console.log("  \x1b[36mskillsbd\x1b[0m \x1b[90m— навыки для AI-агентов\x1b[0m\n");

switch (command) {
  case "add":
  case "install":
  case "i":
    cloneSkill(args[1], args[2]);
    break;
  case "list":
  case "ls":
    listSkills();
    break;
  case "remove":
  case "rm":
    removeSkill(args[1]);
    break;
  case "search":
  case "find":
    await searchSkills(args.slice(1).join(" "));
    break;
  default:
    error(`Неизвестная команда: ${command}`);
    console.log(HELP);
    process.exit(1);
}

console.log();
