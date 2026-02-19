"use client";

import { useEffect, useState } from "react";
import { Users, MessageSquare, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  bug: "Bug Report",
  suggestion: "Suggestion",
  contribute: "Contribute",
};

const PIE_COLORS = ["#d4a574", "#2d6a4f", "#e07a5f", "#8b5cf6"];

const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a24",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 13,
};

const AXIS_TICK = { fill: "#737373", fontSize: 11 };

interface Stats {
  totalUsers: number;
  totalMessages: number;
  recentSignups: number;
  messagesByCategory: Record<string, number>;
  signupsByDay: Record<string, number>;
  messagesByDay: Record<string, number>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
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

  const signupChartData = Object.entries(stats.signupsByDay).map(
    ([date, count]) => ({ date: date.slice(5), signups: count }),
  );

  const messageChartData = Object.entries(stats.messagesByDay).map(
    ([date, count]) => ({ date: date.slice(5), messages: count }),
  );

  const categoryChartData = Object.entries(stats.messagesByCategory).map(
    ([category, count]) => ({
      name: CATEGORY_LABELS[category] ?? category,
      value: count,
    }),
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} />
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

      {/* Signups area chart */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">
            User Signups (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.totalUsers === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">
              No signups yet.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={signupChartData}>
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a574" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#d4a574" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="date"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="#d4a574"
                  strokeWidth={2}
                  fill="url(#signupGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Messages bar chart + Category pie chart */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">
              Messages (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalMessages === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-400">
                No messages yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={messageChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={AXIS_TICK}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={AXIS_TICK}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar
                    dataKey="messages"
                    fill="#2d6a4f"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Messages by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryChartData.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-400">
                No messages yet.
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryChartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4">
                  {categoryChartData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-xs text-neutral-400">
                        {entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
