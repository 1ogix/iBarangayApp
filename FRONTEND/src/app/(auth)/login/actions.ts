'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    return redirect("/login?message=User profile not found");
  }

  revalidatePath("/", "layout");

  if (profile.role === "admin") {
    redirect("/admin/overview");
  } else {
    redirect("/user/dashboard");
  }
}
