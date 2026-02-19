"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllMessages, type ContactMessage } from "@/lib/firebase/firestore";
import type { Timestamp } from "firebase/firestore";

const CATEGORIES = ["all", "general", "bug", "suggestion", "contribute"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  general: "General",
  bug: "Bug Report",
  suggestion: "Suggestion",
  contribute: "Contribute",
};

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-blue-500/20 text-blue-300",
  bug: "bg-red-500/20 text-red-300",
  suggestion: "bg-green-500/20 text-green-300",
  contribute: "bg-purple-500/20 text-purple-300",
};

function formatDate(ts: unknown): string {
  if (!ts || typeof (ts as { toDate?: unknown }).toDate !== "function")
    return "—";
  return (ts as Timestamp).toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type MessageWithId = ContactMessage & { id: string };

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    getAllMessages()
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return messages;
    return messages.filter((m) => m.category === filter);
  }, [messages, filter]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-[#d4a574] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-white">Messages</h1>
        <Badge variant="secondary" className="w-fit">
          {messages.length} total
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-[#d4a574] text-black"
                : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="size-5 text-[#d4a574]" />
            Contact Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">
              No messages found.
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((msg) => {
                const isExpanded = expanded.has(msg.id);
                return (
                  <div
                    key={msg.id}
                    className="rounded-lg border border-white/5 bg-white/[0.02] transition-colors hover:border-white/10"
                  >
                    <button
                      onClick={() => toggleExpand(msg.id)}
                      className="flex w-full items-center gap-4 p-4 text-left"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-white">
                            {msg.name}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {msg.email}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[msg.category] ?? "bg-white/10 text-neutral-300"}`}
                          >
                            {CATEGORY_LABELS[msg.category] ?? msg.category}
                          </span>
                        </div>
                        <p className="line-clamp-1 text-sm text-neutral-400">
                          {msg.message}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="hidden text-xs text-neutral-500 sm:block">
                          {formatDate(msg.createdAt)}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="size-4 text-neutral-400" />
                        ) : (
                          <ChevronDown className="size-4 text-neutral-400" />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-white/5 p-4 pt-3">
                        {msg.subject && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-neutral-500">
                              Subject:{" "}
                            </span>
                            <span className="text-sm text-neutral-300">
                              {msg.subject}
                            </span>
                          </div>
                        )}
                        {msg.page && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-neutral-500">
                              Page:{" "}
                            </span>
                            <span className="text-sm text-neutral-300">
                              {msg.page}
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                          {msg.message}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                          <span>{formatDate(msg.createdAt)}</span>
                          {msg.uid && <span>UID: {msg.uid}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
