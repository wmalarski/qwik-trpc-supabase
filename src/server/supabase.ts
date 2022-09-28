import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "./serverEnv";

export const supabase = createClient(
  serverEnv.VITE_SUPABASE_URL,
  serverEnv.VITE_SUPABASE_ANON_KEY
);
