import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Barangay Clearance" description="Request a barangay clearance online." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Barangay Clearance</h2>
        <p className="mt-2 text-sm">This is a placeholder for the barangay clearance view.</p>
      </div>
    </div>
  );
}
