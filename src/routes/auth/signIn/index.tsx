import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { supabase, updateAuthCookies } from "~/server/auth/auth";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";
import { getUser } from "../../layout";
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
    return result;
  }

  updateAuthCookies(result.data.session, event.cookie);

  throw event.redirect(302, paths.board);
});

export const signInOtp = action$((form) => {
  const email = form.get("email") as string;

  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${getBaseUrl()}${paths.callback}` },
  });
});

export const getData = loader$(async (event) => {
  const user = await event.getData(getUser);
  if (user) {
    throw event.redirect(302, paths.index);
  }
});

export default component$(() => {
  getData.use();

  const signInPasswordAction = signInPassword.use();
  const signInOtpAction = signInOtp.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Sign In</h1>
      <div class="flex flex-col gap-6">
        <MagicLinkForm action={signInOtpAction} />
        <PasswordForm action={signInPasswordAction} />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
