import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Barangay Office Appointments" description="Manage office visits and queue numbers." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Barangay Office Appointments</h2>
        <p className="mt-2 text-sm">This is a placeholder for the barangay office appointments view.</p>
      </div>
    </div>
  );
}
