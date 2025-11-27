"use client";

import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/layouts/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type Appointment = {
  id: string;
  user_id: string | null;
  type: string;
  reason: string | null;
  schedule_at: string;
  status: AppointmentStatus;
  contact: string | null;
  notes?: string;
};

const statusOptions: AppointmentStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];

type NewAppointmentForm = {
  userId: string;
  type: string;
  reason: string;
  schedule: string;
  status: AppointmentStatus;
  contact: string;
  notes: string;
};

const newAppointmentDefault: NewAppointmentForm = {
  userId: "",
  type: "Health Center",
  reason: "",
  schedule: "",
  status: "Pending",
  contact: "",
  notes: "",
};

export default function Page() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">("All");
  const [open, setOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<NewAppointmentForm>(newAppointmentDefault);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/appointments", { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to load appointments");
      }
      setAppointments(payload.data || []);
    } catch (err: any) {
      setError(err.message || "Unable to load appointments right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
      const matchesSearch =
        !search ||
        appt.id.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [appointments, search, statusFilter]);

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to update status");
      }
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
      );
    } catch (err: any) {
      setError(err.message || "Unable to update status.");
    }
  };

  const addAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: newAppointment.userId,
          type: newAppointment.type,
          reason: newAppointment.reason,
          schedule_at: newAppointment.schedule,
          status: newAppointment.status,
          contact: newAppointment.contact,
          notes: newAppointment.notes,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to create appointment");
      }
      setNewAppointment(newAppointmentDefault);
      setOpen(false);
      await loadAppointments();
    } catch (err: any) {
      setError(err.message || "Unable to create appointment.");
    }
  };

  const stats = useMemo(() => {
    const byStatus: Record<AppointmentStatus, number> = {
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
    };
    appointments.forEach((appt) => {
      const status = statusOptions.includes(appt.status) ? appt.status : "Pending";
      byStatus[status] += 1;
    });
    return byStatus;
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Health Center Appointments"
          description="Coordinate clinic schedules and patient queues."
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="self-start sm:self-auto">
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create appointment</DialogTitle>
              <DialogDescription>Capture request details before confirming.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={addAppointment}>
              <div className="space-y-2">
                <Label htmlFor="userId">Resident user ID</Label>
                <Input
                  id="userId"
                  value={newAppointment.userId}
                  placeholder="Supabase auth user ID"
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, userId: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Appointment type</Label>
                <select
                  id="type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newAppointment.type}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      type: e.target.value as Appointment["type"],
                    }))
                  }
                >
                  <option>Health Center</option>
                  <option>Barangay Office</option>
                  <option>Business Permit</option>
                  <option>Document Pickup</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schedule">Date & time</Label>
                  <Input
                    id="schedule"
                    type="datetime-local"
                  value={newAppointment.schedule}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, schedule: e.target.value }))
                  }
                  required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={newAppointment.status}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        status: e.target.value as AppointmentStatus,
                      }))
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="resident@email.com or phone"
                  value={newAppointment.contact}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, contact: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={newAppointment.reason}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="Purpose or symptoms"
                  rows={3}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusOptions.map((status) => (
          <Card key={status}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{status}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stats[status]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Appointment queue</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Search name or ref no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:w-64"
            />
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | "All")}
            >
              <option value="All">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading appointments...</p>}
          {!loading && filteredAppointments.length === 0 && (
            <p className="text-sm text-muted-foreground">No appointments found.</p>
          )}
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="flex flex-col gap-3 rounded-lg border bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  {appt.contact || "Unknown contact"}{" "}
                  <span className="text-muted-foreground">• {appt.type}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Ref {appt.id} • {new Date(appt.schedule_at).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Reason: {appt.reason || "n/a"}</p>
                {appt.notes && (
                  <p className="text-xs text-muted-foreground">Notes: {appt.notes}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-40"
                  value={appt.status}
                  onChange={(e) => updateStatus(appt.id, e.target.value as AppointmentStatus)}
                >
                  {statusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <Button variant="outline" size="sm">
                  View details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
