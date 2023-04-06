import type { RequestEventCommon } from "@builder.io/qwik-city";
import { createClient } from "@supabase/supabase-js";

const supabaseMapKey = "__supabase";

export const createSupabase = (event: RequestEventCommon) => {
  const cached = event.sharedMap.get(supabaseMapKey);

  if (cached) {
    return cached;
  }

  const url = event.env.get("VITE_SUPABASE_URL");
  const key = event.env.get("VITE_SUPABASE_ANON_KEY");

  if (!url || !key) {
    throw new Error("NO ENV VARIABLES");
  }

  console.log("createClient");

  const client = createClient(url, key, { auth: { persistSession: false } });

  event.sharedMap.set(supabaseMapKey, client);

  return client;
};
