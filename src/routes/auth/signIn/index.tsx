import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { supabase, updateAuthCookies } from "~/server/auth/auth";
import { getUserFromEvent } from "~/server/loaders";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";
import { MagicLinkForm } from "./MagicLinkForm/MagicLinkForm";
import { PasswordForm } from "./PasswordForm/PasswordForm";

export const signInPassword = action$(async (form, event) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (result.error || !result.data.session) {
    return { status: "error" };
  }

  updateAuthCookies(result.data.session, event.cookie);

  return { status: "success" };
});

export const signInOtp = action$((form) => {
  const email = form.get("email") as string;

  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${getBaseUrl()}${paths.callback}` },
  });
});

export const getData = loader$(async (event) => {
  const user = await getUserFromEvent(event);
  if (user) {
    throw event.redirect(302, paths.index);
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
