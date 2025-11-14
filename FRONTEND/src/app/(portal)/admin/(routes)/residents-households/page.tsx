import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Residents & Households" description="Maintain the master list of residents and household profiles." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Residents & Households</h2>
        <p className="mt-2 text-sm">This is a placeholder for the residents & households view.</p>
      </div>
    </div>
  );
}
