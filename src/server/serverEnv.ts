import { z } from "@builder.io/qwik-city";

const schema = z.object({
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_URL: z.string().url(),
});

const nodeEnv = process.env;
const viteEnv = import.meta.env;

export const serverEnv = schema.parse({
  SUPABASE_ANON_KEY:
    nodeEnv.PUBLIC_SUPABASE_ANON_KEY || viteEnv.PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_URL: nodeEnv.PUBLIC_SUPABASE_URL || viteEnv.PUBLIC_SUPABASE_URL,
});
