import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "./serverEnv";

export const supabase = createClient(
  serverEnv.PUBLIC_SUPABASE_URL,
  serverEnv.PUBLIC_SUPABASE_ANON_KEY
);
