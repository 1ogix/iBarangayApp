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
import { createClient } from "@/utils/supabase/client";

type AppointmentForm = {
  type: string;
  date: string;
  time: string;
  notes: string;
};

type Appointment = {
  id: string;
  type: string;
  reason: string | null;
  schedule_at: string;
  status: string;
  contact: string | null;
  notes: string | null;
};

const defaultForm: AppointmentForm = {
  type: "Health Center",
  date: "",
  time: "",
  notes: "",
};

export default function Page() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AppointmentForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to view appointments.");
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("schedule_at", { ascending: true });
      if (error) {
        setError(error.message);
      } else {
        setAppointments(data || []);
      }
    } catch (err) {
      setError("Unable to load appointments right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to create an appointment.");
        setIsSubmitting(false);
        return;
      }

      const schedule_at = `${form.date}T${form.time}`;
      const { error } = await supabase.from("appointments").insert([
        {
          user_id: user.id,
          type: form.type,
          reason: form.notes || "Appointment request",
          notes: form.notes,
          status: "Pending",
          contact: user.email,
          schedule_at,
        },
      ]);

      if (error) {
        setError(error.message);
        setIsSubmitting(false);
        return;
      }

      setMessage(
        "Appointment request submitted. We'll confirm the schedule soon."
      );
      setForm(defaultForm);
      setOpen(false);
      await loadAppointments();
    } catch (err) {
      setError("Unable to submit appointment right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const grouped = useMemo(() => {
    return {
      upcoming: appointments.filter((appt) => appt.status !== "Completed"),
      completed: appointments.filter((appt) => appt.status === "Completed"),
    };
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Appointments"
          description="Book health center or barangay office appointments."
        />
        {message && (
          <p className="text-sm font-medium text-green-700 sm:text-right">
            {message}
          </p>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="self-start sm:self-auto">
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
              <DialogDescription>
                Provide the details below and we will confirm your slot.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="type">Appointment type</Label>
                <select
                  id="type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                >
                  <option>Health Center</option>
                  <option>Barangay Office</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Reason for visit, needed documents, or special assistance"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => !isSubmitting && setOpen(true)}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming requests</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading appointments...
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!isLoading && !error && grouped.upcoming.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No appointments scheduled yet.
            </p>
          )}
          {grouped.upcoming.map((appt) => (
            <div
              key={appt.id}
              className="rounded-md border bg-background/60 p-4"
            >
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="text-base font-semibold">{appt.type}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                When: {new Date(appt.schedule_at).toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Status:{" "}
                <span className="font-medium text-primary">{appt.status}</span>
              </p>
              {appt.notes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Notes: {appt.notes}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {grouped.completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {grouped.completed.map((appt) => (
              <div
                key={appt.id}
                className="rounded-md border bg-background/60 p-4"
              >
                <p className="text-sm font-semibold">{appt.type}</p>
                <p className="text-sm text-muted-foreground">
                  When: {new Date(appt.schedule_at).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Notes: {appt.notes || appt.reason || "n/a"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
