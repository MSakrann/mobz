import { redirect } from "next/navigation";

import { getUserId } from "@drape/lib/supabase/adapter";
import { createServerClient } from "@drape/lib/supabase/server";

export default async function ResultsPage() {
  const supabase = await createServerClient();
  const userId = await getUserId(supabase);

  if (!userId) {
    redirect("/drape/sign-in");
  }

  const { data, error } = await supabase
    .from("generations")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    redirect("/drape/dashboard");
  }

  redirect(data ? `/drape/results/${data.id}` : "/drape/generate");
}
