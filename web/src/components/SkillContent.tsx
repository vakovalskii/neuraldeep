"use client";

import { useState, useEffect } from "react";

export default function SkillContent({ skillId }: { skillId: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/readme?skillId=${skillId}`)
      .then((r) => r.json())
      .then((data) => {
        setContent(data.content || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [skillId]);

  if (loading) return <div className="h-20 animate-pulse rounded-lg bg-gray-900" />;
  if (!content) return null;

  // Убираем frontmatter если есть
  const cleaned = content.replace(/^---[\s\S]*?---\s*/m, "").trim();
  const lines = cleaned.split("\n");
  const preview = lines.slice(0, 8).join("\n");
  const hasMore = lines.length > 8;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">SKILL.md</h2>
      <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
        <div
          className={`px-4 py-4 text-sm text-gray-400 font-mono whitespace-pre-wrap leading-relaxed ${
            !expanded && hasMore ? "max-h-48 overflow-hidden relative" : ""
          }`}
        >
          {expanded ? cleaned : preview}
          {!expanded && hasMore && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent" />
          )}
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full border-t border-gray-800 px-4 py-2 text-xs text-gray-500 hover:text-foreground transition-colors"
          >
            {expanded ? "Свернуть" : "Показать полностью"}
          </button>
        )}
      </div>
    </div>
  );
}
