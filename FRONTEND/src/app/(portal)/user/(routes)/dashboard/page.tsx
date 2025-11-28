"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarClock,
  ClipboardList,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

type RequestRow = {
  id: string;
  type: string;
  status: string | null;
  created_at?: string | null;
};

type AppointmentRow = {
  id: string;
  type: string;
  status: string | null;
  schedule_at: string | null;
};

type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const quickActions: QuickAction[] = [
  {
    title: "Apply for a document",
    description: "Barangay clearance, business permits, or certificates.",
    href: "/user/apply/barangay-clearance",
    icon: FileText,
  },
  {
    title: "Book an appointment",
    description: "Reserve a slot at the barangay office or health center.",
    href: "/user/appointments",
    icon: CalendarClock,
  },
  {
    title: "Track my requests",
    description: "See statuses, pickup details, and download PDFs.",
    href: "/user/my-requests",
    icon: ClipboardList,
  },
  {
    title: "Need help?",
    description: "Message the barangay team for clarifications.",
    href: "/user/help-support",
    icon: Bell,
  },
];

const advisories = [
  {
    title: "Bring a valid ID on pickup",
    detail: "Government ID is required when claiming approved documents.",
  },
  {
    title: "Online maintenance",
    detail: "Portal services may be slow on Sat, 10:00 PM – 11:00 PM.",
  },
  {
    title: "Community announcement",
    detail: "General assembly at the barangay gym on May 25, 4:00 PM.",
  },
];

function statusTone(status?: string | null) {
  const normalized = (status || "").toLowerCase();
  if (normalized === "approved" || normalized === "completed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (normalized === "pending") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (normalized === "processing" || normalized === "in-progress") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  if (normalized === "rejected") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function Page() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Sign in to view your latest requests and appointments.");
          setIsLoading(false);
          return;
        }

        const [requestsResult, appointmentsResult] = await Promise.all([
          supabase
            .from("requests")
            .select("id,type,status,created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("appointments")
            .select("id,type,status,schedule_at")
            .eq("user_id", user.id)
            .order("schedule_at", { ascending: true })
            .limit(3),
        ]);

        if (requestsResult.error || appointmentsResult.error) {
          setError("Unable to load your latest activity right now.");
        } else {
          setRequests(requestsResult.data || []);
          setAppointments(appointmentsResult.data || []);
        }
      } catch (err) {
        setError("Unable to load your latest activity right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const normalize = (value?: string | null) => (value || "").toLowerCase();
    const activeRequests = requests.filter(
      (request) => normalize(request.status) !== "completed"
    );
    const pendingRequests = requests.filter(
      (request) => normalize(request.status) === "pending"
    );
    const approvedRequests = requests.filter(
      (request) => normalize(request.status) === "approved"
    );
    const upcomingAppointments = appointments.filter(
      (appointment) => normalize(appointment.status) !== "completed"
    );

    return [
      {
        label: "Active requests",
        value: activeRequests.length,
        hint: "Open items across all services",
      },
      {
        label: "Awaiting approval",
        value: pendingRequests.length,
        hint: "We will notify you once reviewed",
      },
      {
        label: "Approved",
        value: approvedRequests.length,
        hint: "Ready for pickup or download",
      },
      {
        label: "Upcoming appointments",
        value: upcomingAppointments.length,
        hint: "Remember to bring a valid ID",
      },
    ];
  }, [requests, appointments]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Citizen Dashboard"
        description="Check your latest requests, appointments, and advisories in one place."
      />

      {error && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={`stat-skeleton-${index}`}
                className="h-full border-dashed bg-muted/40"
              >
                <CardHeader className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-7 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </CardHeader>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.label} className="h-full">
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl font-bold">
                    {stat.value}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{stat.hint}</p>
                </CardHeader>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="h-full">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Recent requests</CardTitle>
              <CardDescription>
                Latest updates from the barangay team.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/user/my-requests">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center gap-3 px-6 py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Loading your requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="px-6 py-8 text-sm text-muted-foreground">
                No requests yet. Start a document application to see updates
                here.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(
                            request.status
                          )}`}
                        >
                          {request.status ?? "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Upcoming appointments</CardTitle>
              <CardDescription>
                Confirmed and pending bookings for your visits.
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/user/appointments">Book appointment</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Loading your appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-md border border-dashed bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
                No upcoming appointments. Book a slot to avoid walk-in queues.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between rounded-lg border bg-background/60 p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-primary" />
                        <p className="font-medium">{appointment.type}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(appointment.schedule_at)} •{" "}
                        {appointment.schedule_at
                          ? new Date(
                              appointment.schedule_at
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "Time TBA"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(
                        appointment.status
                      )}`}
                    >
                      {appointment.status ?? "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>
              Jump to the most common services you need.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-start gap-3 rounded-lg border bg-background/60 p-4 transition hover:border-primary hover:shadow-sm"
              >
                <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium leading-tight group-hover:text-primary">
                    {action.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Advisories
            </CardTitle>
            <CardDescription>
              Stay updated on reminders, outages, and community events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {advisories.map((advisory) => (
              <div
                key={advisory.title}
                className="rounded-lg border bg-muted/40 p-4"
              >
                <p className="font-medium">{advisory.title}</p>
                <p className="text-sm text-muted-foreground">
                  {advisory.detail}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
