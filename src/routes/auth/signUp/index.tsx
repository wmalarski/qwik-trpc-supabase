import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$, z, zod$ } from "@builder.io/qwik-city";
import { supabase } from "~/server/auth/auth";
import { getUserFromEvent } from "~/server/loaders";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";
import { RegisterForm } from "./RegisterForm/RegisterForm";

export const getData = loader$(async (event) => {
  const user = await getUserFromEvent(event);
  if (user) {
    event.redirect(302, paths.index);
  }
});

export const signUp = action$(
  async (data) => {
    const emailRedirectTo = `${getBaseUrl()}${paths.callback}`;
    const result = await supabase.auth.signUp({
      ...data,
      options: { emailRedirectTo },
    });

    if (result.error) {
      return { status: "error" };
    }

    return { status: "success" };
  },
  zod$(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }).shape
  )
);

export default component$(() => {
  getData.use();

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
