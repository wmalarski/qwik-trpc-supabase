import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$, z, zod$ } from "@builder.io/qwik-city";
import { supabase, updateAuthCookies } from "~/server/auth/auth";
import { getUserFromEvent } from "~/server/loaders";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";
import { MagicLinkForm } from "./MagicLinkForm/MagicLinkForm";
import { PasswordForm } from "./PasswordForm/PasswordForm";

export const signInPassword = action$(
  async (data, event) => {
    const result = await supabase.auth.signInWithPassword(data);

    if (result.error || !result.data.session) {
      return { status: "error" };
    }

    updateAuthCookies(result.data.session, event.cookie);

    return { status: "success" };
  },
  zod$({
    email: z.string().email(),
    password: z.string(),
  })
);

export const signInOtp = action$(
  (data) => {
    return supabase.auth.signInWithOtp({
      email: data.email,
      options: { emailRedirectTo: `${getBaseUrl()}${paths.callback}` },
    });
  },
  zod$({
    email: z.string().email(),
  })
);

export const getData = loader$(async (event) => {
  const user = await getUserFromEvent(event);
  if (user) {
    event.redirect(302, paths.index);
  }
});

export default component$(() => {
  getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Sign In</h1>
      <div class="flex flex-col gap-6">
        <MagicLinkForm />
        <PasswordForm />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
