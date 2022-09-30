import { RequestHandler } from "@builder.io/qwik-city";
import { z } from "zod";
import { supabase, updateAuthCookies } from "~/server/supabase";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const onPost: RequestHandler = async (ev) => {
  const json = await ev.request.json();

  const args = formSchema.parse(json);

  const result = await supabase.auth.signIn(args);

  console.log({ result });

  if (result.error || !result.session) {
    throw new Error(result.error?.message || "INVALID_INPUT");
  }

  await updateAuthCookies(result.session, ev.response);

  return null;
};
