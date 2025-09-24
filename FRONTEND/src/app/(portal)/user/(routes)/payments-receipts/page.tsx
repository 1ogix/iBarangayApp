import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payments & Receipts" description="Review payments made and download official receipts." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Payments & Receipts</h2>
        <p className="mt-2 text-sm">This is a placeholder for the payments & receipts view.</p>
      </div>
    </div>
  );
}
