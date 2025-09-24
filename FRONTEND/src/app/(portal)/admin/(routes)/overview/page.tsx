import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin Overview" description="High-level metrics and operational snapshot for staff." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Admin Overview</h2>
        <p className="mt-2 text-sm">This is a placeholder for the admin overview view.</p>
      </div>
    </div>
  );
}
