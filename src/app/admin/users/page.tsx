"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllUsers } from "@/lib/firebase/firestore";
import type { UserDocument } from "@/lib/firebase/types";
import type { Timestamp } from "firebase/firestore";

function formatDate(ts: unknown): string {
  if (!ts || typeof (ts as { toDate?: unknown }).toDate !== "function")
    return "—";
  return (ts as Timestamp).toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

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
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        <Badge variant="secondary" className="w-fit">
          {users.length} total
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-neutral-500"
        />
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="size-5 text-[#d4a574]" />
            Registered Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">
              {search ? "No users match your search." : "No users yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Signed Up</th>
                    <th className="pb-3 font-medium">Last Synced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((user) => (
                    <tr key={user.uid} className="text-neutral-300">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="size-8 rounded-full"
                            />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-full bg-[#d4a574]/20 text-xs font-medium text-[#d4a574]">
                              {(user.displayName ?? user.email)?.[0]?.toUpperCase() ?? "?"}
                            </div>
                          )}
                          <span className="font-medium text-white">
                            {user.displayName ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">{user.email}</td>
                      <td className="py-3 pr-4">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3">
                        {formatDate(user.lastSyncedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
