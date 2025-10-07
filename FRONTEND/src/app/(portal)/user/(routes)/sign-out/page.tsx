'use client';

import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sign Out" description="Sign out of your BrgyGo account." />
      <div className="rounded-lg border bg-background/60 p-10 text-center">
        <h2 className="text-lg font-semibold">You are about to sign out</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to sign out of your account?
        </p>
        <form action={signOut} className="mt-6">
          <Button type="submit">Yes, sign out</Button>
        </form>
      </div>
    </div>
  );
}
