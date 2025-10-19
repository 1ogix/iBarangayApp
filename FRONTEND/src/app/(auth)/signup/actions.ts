"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

// In a real application, this should be an environment variable.
const ADMIN_SECRET_CODE = "SUPER_SECRET_CODE";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const secretCode = formData.get("secret_code") as string;
  const supabase = createClient();

  let role = "user";
  if (secretCode === ADMIN_SECRET_CODE) {
    role = "admin";
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    return redirect(`/signup?message=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Check email to continue sign in process");
}
