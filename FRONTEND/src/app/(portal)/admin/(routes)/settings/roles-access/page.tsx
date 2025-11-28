"use client";

import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string | null;
};

const ROLE_OPTIONS = ["admin", "staff", "user"] as const;

export default function Page() {
  const supabase = useMemo(() => createClient(), []);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("id,full_name,role")
          .order("full_name", { ascending: true })
          .limit(50);
        if (fetchError) {
          setError("Unable to load profiles. Please refresh.");
          return;
        }
        setProfiles(
          (data as ProfileRow[])?.map((row) => ({
            ...row,
            role: row.role ?? "user",
          })) ?? []
        );
      } catch (err) {
        setError("Unable to load profiles. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [supabase]);

  const handleRoleChange = (id: string, newRole: string) => {
    setProfiles((prev) =>
      prev.map((row) => (row.id === id ? { ...row, role: newRole } : row))
    );
    setMessage("Updated locally. Click Save to apply.");
  };

  const handleSave = async (profile: ProfileRow) => {
    setSavingId(profile.id);
    setMessage(null);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: profile.role })
        .eq("id", profile.id);
      if (updateError) {
        setError("Failed to save role. Please try again.");
        return;
      }
      setMessage("Role updated.");
    } catch (err) {
      setError("Failed to save role. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Access"
        description="Configure staff roles, permissions, and access scopes."
      />

      {error && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team roles</CardTitle>
          <CardDescription>
            Assign admin, staff, or user roles to control access.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                    Loading profiles...
                  </TableCell>
                </TableRow>
              ) : profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-6 text-center text-sm text-muted-foreground">
                    No profiles found.
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.full_name || "Unnamed user"}
                      <div className="text-xs text-muted-foreground">{profile.id}</div>
                    </TableCell>
                    <TableCell>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={profile.role ?? "user"}
                        onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                        disabled={savingId === profile.id}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSave(profile)}
                        disabled={savingId === profile.id}
                      >
                        {savingId === profile.id ? "Saving..." : "Save"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
