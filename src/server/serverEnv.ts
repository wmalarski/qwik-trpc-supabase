import { z } from "zod";

const schema = z.object({
  VITE_SUPABASE_URL: z.string(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  VITE_REDIRECT_URL: z.string(),
});

console.log("env", process.env);

export const serverEnv = schema.parse(process.env);
