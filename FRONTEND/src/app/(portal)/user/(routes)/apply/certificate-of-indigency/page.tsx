import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Certificate of Indigency" description="Start a request for indigency certification." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Certificate of Indigency</h2>
        <p className="mt-2 text-sm">This is a placeholder for the certificate of indigency view.</p>
      </div>
    </div>
  );
}
