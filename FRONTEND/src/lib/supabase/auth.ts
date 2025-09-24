import { createSupabaseServerClient } from "./server";

export async function getSession() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return session;
}
