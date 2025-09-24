import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Sign Out" description="Sign out of your BrgyGo account." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Sign Out</h2>
        <p className="mt-2 text-sm">This is a placeholder for the sign out view.</p>
      </div>
    </div>
  );
}
