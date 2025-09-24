import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Barangay Business Clearance" description="Apply for a business clearance for barangay-issued permits." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Barangay Business Clearance</h2>
        <p className="mt-2 text-sm">This is a placeholder for the barangay business clearance view.</p>
      </div>
    </div>
  );
}
