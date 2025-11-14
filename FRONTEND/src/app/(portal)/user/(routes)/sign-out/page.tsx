"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/client";
import { PageHeader } from "@/components/layouts/page-header";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const signOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login?message=You have been signed out.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sign Out"
        description="Sign out of your BrgyGo account."
      />
      <div className="rounded-lg border bg-background/60 p-10 text-center">
        <h2 className="text-lg font-semibold">You are about to sign out</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to sign out of your account?
        </p>
        <div className="mt-6">
          <Button onClick={signOut} disabled={isSigningOut}>
            {isSigningOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              "Yes, sign out"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
