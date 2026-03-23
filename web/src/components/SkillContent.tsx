"use client";

import { useState, useEffect } from "react";
import Markdown from "react-markdown";

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

  const cleaned = content.replace(/^---[\s\S]*?---\s*/m, "").trim();
  const isLong = cleaned.length > 800;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">SKILL.md</h2>
      <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
        <div
          className={`px-5 py-4 text-sm text-gray-400 leading-relaxed ${
            !expanded && isLong ? "max-h-64 overflow-hidden relative" : ""
          }`}
        >
          <Markdown
            components={{
              h1: ({ children }) => <h1 className="text-xl font-bold text-foreground mt-5 mb-3 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold text-foreground mt-5 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold text-foreground mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <pre className="rounded-md bg-gray-950 border border-gray-800 p-4 my-3 overflow-x-auto text-xs leading-relaxed">
                      <code>{children}</code>
                    </pre>
                  );
                }
                return (
                  <code className="text-accent bg-gray-950 px-1.5 py-0.5 rounded text-xs">{children}</code>
                );
              },
              pre: ({ children }) => <>{children}</>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{children}</a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-3">
                  <table className="text-xs w-full border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="border-b border-gray-700">{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr className="border-b border-gray-800/50">{children}</tr>,
              th: ({ children }) => <th className="text-left text-gray-400 font-medium py-2 pr-4 whitespace-nowrap">{children}</th>,
              td: ({ children }) => <td className="text-gray-400 py-2 pr-4">{children}</td>,
              strong: ({ children }) => <strong className="text-foreground font-medium">{children}</strong>,
              em: ({ children }) => <em className="text-gray-300">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-accent/50 pl-4 my-3 text-gray-500 italic">{children}</blockquote>
              ),
              hr: () => <hr className="border-gray-800 my-4" />,
              img: ({ src, alt }) => (
                <img src={src} alt={alt || ""} className="rounded-md max-w-full my-3" />
              ),
            }}
          >
            {cleaned}
          </Markdown>
          {!expanded && isLong && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent" />
          )}
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full border-t border-gray-800 px-4 py-2.5 text-xs text-gray-500 hover:text-foreground transition-colors"
          >
            {expanded ? "Свернуть" : "Показать полностью"}
          </button>
        )}
      </div>
    </div>
  );
}
