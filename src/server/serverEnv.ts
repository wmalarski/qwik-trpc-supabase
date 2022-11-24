import { z } from "zod";

const schema = z.object({
  VITE_SUPABASE_ANON_KEY: z.string(),
  VITE_SUPABASE_URL: z.string().url(),
});

const nodeEnv = process.env;
const viteEnv = import.meta.env;

export const serverEnv = schema.parse({
  VITE_SUPABASE_ANON_KEY:
    nodeEnv.VITE_SUPABASE_ANON_KEY || viteEnv.VITE_SUPABASE_ANON_KEY,
  VITE_SUPABASE_URL: nodeEnv.VITE_SUPABASE_URL || viteEnv.VITE_SUPABASE_URL,
});
