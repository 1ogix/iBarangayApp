import { PageHeader } from "@/components/layouts/page-header";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log(user?.role);

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
