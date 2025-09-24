import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Announcements & Broadcast" description="Publish advisories and multi-channel broadcasts." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Announcements & Broadcast</h2>
        <p className="mt-2 text-sm">This is a placeholder for the announcements & broadcast view.</p>
      </div>
    </div>
  );
}
