import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" description="FAQs, contact options, and assistance requests." />
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h2 className="text-lg font-semibold">Help & Support</h2>
        <p className="mt-2 text-sm">This is a placeholder for the help & support view.</p>
      </div>
    </div>
  );
}
