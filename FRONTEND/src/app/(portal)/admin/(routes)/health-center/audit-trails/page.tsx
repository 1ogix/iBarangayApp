"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AuditRow = {
  id: number;
  appointment_id: string;
  old_status: string | null;
  new_status: string | null;
  changed_by: string | null;
  changed_at: string;
  notes: string | null;
  appointments?: {
    contact: string | null;
    user_id: string | null;
  } | null;
};

export default function Page() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAudit = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/appointments/audit", { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to load audit trails");
      }
      setRows(payload.data || []);
    } catch (err: any) {
      setError(err.message || "Unable to load audit trails right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointment Audit Trails"
        description="Track status changes for appointments."
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading audit trail...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && rows.length === 0 && (
            <p className="text-sm text-muted-foreground">No audit entries yet.</p>
          )}
          {!loading &&
            !error &&
            rows.map((row) => (
              <div key={row.id} className="rounded-md border bg-background/60 p-3">
                <p className="text-sm font-semibold">
                  Appointment {row.appointment_id}
                  <span className="text-muted-foreground"> • {new Date(row.changed_at).toLocaleString()}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Name / contact: {row.appointments?.contact || row.appointments?.user_id || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(row.old_status && row.old_status !== "") ? row.old_status : "Created"} →{" "}
                  <span className="font-medium text-primary">{row.new_status}</span>
                </p>
                {row.notes && (
                  <p className="text-xs text-muted-foreground">Notes: {row.notes}</p>
                )}
                {row.changed_by && (
                  <p className="text-xs text-muted-foreground">Changed by: {row.changed_by}</p>
                )}
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
