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

type ResidentRow = {
  id: string;
  full_name: string | null;
  role: string | null;
  address?: string | null;
  barangay?: string | null;
  purok?: string | null;
};

function formatAddress(resident: ResidentRow) {
  const parts = [resident.barangay, resident.purok].filter(Boolean);
  if (resident.address) parts.unshift(resident.address);
  return parts.length ? parts.join(", ") : "—";
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const supabase = await createClient();
  const q = (searchParams?.q || "").trim();

  // Summary counts
  const [
    { count: totalResidents },
    { count: adminCount },
    { count: staffCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "staff"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user"),
  ]);

  let residentsQuery = supabase
    .from("profiles")
    .select("id,full_name,role,address,barangay,purok")
    .order("full_name", { ascending: true })
    .limit(50);

  if (q) {
    residentsQuery = residentsQuery.or(
      `full_name.ilike.%${q}%,address.ilike.%${q}%,barangay.ilike.%${q}%,purok.ilike.%${q}%`
    );
  }

  const { data: residents, error } = await residentsQuery;

  const stats = [
    { label: "Residents", value: totalResidents ?? 0, hint: "All profiles" },
    { label: "Admins", value: adminCount ?? 0, hint: "Full access" },
    { label: "Staff", value: staffCount ?? 0, hint: "Operational access" },
    { label: "Users", value: userCount ?? 0, hint: "Citizen accounts" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Residents & Households"
        description="Maintain the master list of residents and household profiles."
      />

      {error && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Unable to load residents right now. Please refresh.
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

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Resident registry</CardTitle>
            <CardDescription>Search and review resident records.</CardDescription>
          </div>
          <form className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by name, barangay, or purok"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-72"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Search
            </button>
          </form>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents && residents.length > 0 ? (
                (residents as ResidentRow[]).map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell className="font-medium">
                      {resident.full_name || "Unnamed"}
                      <div className="text-xs text-muted-foreground">{resident.id}</div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {resident.role ?? "user"}
                    </TableCell>
                    <TableCell>
                      {resident.barangay || resident.purok
                        ? [resident.barangay, resident.purok].filter(Boolean).join(", ")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatAddress(resident)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    No residents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
