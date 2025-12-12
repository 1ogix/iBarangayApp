import { PageHeader } from "@/components/layouts/page-header";
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
import { createClient } from "@/utils/supabase/server";

type RequestRow = {
  id: string;
  type: string;
  status: string | null;
  created_at: string | null;
};

type AppointmentRow = {
  id: string;
  type: string;
  status: string | null;
  schedule_at: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function Page() {
  const supabase = await createClient();

  // Summary counts
  const [
    { count: totalRequests },
    { count: pendingRequests },
    { count: totalAppointments },
    { count: upcomingAppointments },
  ] = await Promise.all([
    supabase.from("requests").select("*", { count: "exact", head: true }),
    supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("appointments").select("*", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .neq("status", "Completed"),
  ]);

  // Recent activity
  const [
    { data: recentRequests, error: recentRequestsError },
    { data: recentAppointments, error: recentAppointmentsError },
  ] = await Promise.all([
    supabase
      .from("requests")
      .select("id,type,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("appointments")
      .select("id,type,status,schedule_at")
      .order("schedule_at", { ascending: true })
      .limit(5),
  ]);

  const hasError = recentRequestsError || recentAppointmentsError;

  const stats = [
    {
      label: "Total requests",
      value: totalRequests ?? 0,
      hint: "All submitted forms",
    },
    {
      label: "Pending approvals",
      value: pendingRequests ?? 0,
      hint: "Awaiting review",
    },
    {
      label: "Appointments",
      value: totalAppointments ?? 0,
      hint: "All booked visits",
    },
    {
      label: "Upcoming visits",
      value: upcomingAppointments ?? 0,
      hint: "Not yet completed",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        description="High-level metrics and operational snapshot for staff."
      />

      {hasError && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Some data could not be loaded. Please refresh.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="h-full">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
              <p className="text-sm text-muted-foreground">{stat.hint}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent requests</CardTitle>
            <CardDescription>
              Latest submissions across services.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests && recentRequests.length > 0 ? (
                  (recentRequests as RequestRow[]).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-xs">
                        {request.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {request.type}
                      </TableCell>
                      <TableCell className="capitalize">
                        {request.status ?? "—"}
                      </TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      No recent requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming appointments</CardTitle>
            <CardDescription>
              Next visits to the barangay office or health center.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments && recentAppointments.length > 0 ? (
                  (recentAppointments as AppointmentRow[]).map(
                    (appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {appointment.type}
                        </TableCell>
                        <TableCell className="capitalize">
                          {appointment.status ?? "—"}
                        </TableCell>
                        <TableCell>
                          {formatDate(appointment.schedule_at)}
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      No upcoming appointments.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
