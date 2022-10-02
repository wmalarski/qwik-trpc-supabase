import { component$ } from "@builder.io/qwik";
import { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { z } from "zod";
import { RegisterForm } from "~/modules/auth/RegisterForm/RegisterForm";
import { paths } from "~/utils/paths";

export const onPost: RequestHandler = async (ev) => {
  const { supabase, updateAuthCookies } = await import("~/server/auth");

  const json = await ev.request.json();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const args = formSchema.parse(json);

  const result = await supabase.auth.signIn(args);

  if (result.error || !result.session) {
    throw new Error(result.error?.message || "INVALID_INPUT");
  }

  updateAuthCookies(result.session, ev.response);

  return null;
};

export const onGet: RequestHandler = async (ev) => {
  const { getUserByCookie } = await import("~/server/auth");

  const user = await getUserByCookie(ev.request);

  if (user) {
    throw ev.response.redirect(paths.index);
  }
};

export default component$(() => {
  return (
    <div class="flex flex-col gap-2">
      <h1>Sign Up</h1>
      <RegisterForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Welcome to Qwik",
};
