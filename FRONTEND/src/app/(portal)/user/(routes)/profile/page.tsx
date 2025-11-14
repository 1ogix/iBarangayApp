import { PageHeader } from "@/components/layouts/page-header";

import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await (await supabase)
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (error || !profile) {
    // Handle error or profile not found
    return <div>Error loading profile.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal details and household information."
      />
      <div className="rounded-lg border bg-background/60 p-6">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="mt-4 space-y-2">
          <div>
            <p className="font-medium">Full Name</p>
            <p className="text-muted-foreground">{profile.full_name}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
