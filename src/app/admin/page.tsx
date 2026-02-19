"use client";

import { useEffect, useState } from "react";
import { Users, MessageSquare, UserPlus, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/firebase/firestore";

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  bug: "Bug Report",
  suggestion: "Suggestion",
  contribute: "Contribute",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalMessages: number;
    recentSignups: number;
    messagesByCategory: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-[#d4a574] border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="py-20 text-center text-neutral-400">
        Failed to load stats.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={MessageSquare}
          label="Total Messages"
          value={stats.totalMessages}
        />
        <StatCard
          icon={UserPlus}
          label="Signups (Last 7 Days)"
          value={stats.recentSignups}
        />
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="size-5 text-[#d4a574]" />
            Messages by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(stats.messagesByCategory).length === 0 ? (
            <p className="text-sm text-neutral-400">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.messagesByCategory).map(
                ([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-neutral-300">
                      {CATEGORY_LABELS[category] ?? category}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#d4a574]"
                          style={{
                            width: `${Math.min(100, (count / stats.totalMessages) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="min-w-[2rem] text-right text-sm font-medium text-white">
                        {count}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardContent className="flex items-center gap-4 pt-0">
        <div className="flex size-12 items-center justify-center rounded-lg bg-[#d4a574]/15">
          <Icon className="size-6 text-[#d4a574]" />
        </div>
        <div>
          <p className="text-sm text-neutral-400">{label}</p>
          <p className="text-2xl font-semibold text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
