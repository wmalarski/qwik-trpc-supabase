import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getSupabaseSession } from "~/routes/plugin@supabase";
import { paths } from "~/utils/paths";
import { GoogleForm } from "./GoogleForm/GoogleForm";
import { MagicLinkForm } from "./MagicLinkForm/MagicLinkForm";
import { PasswordForm } from "./PasswordForm/PasswordForm";

export const useAnonymousRoute = routeLoader$((event) => {
  const session = getSupabaseSession(event);

  if (session) {
    throw event.redirect(302, paths.index);
  }

  return session;
});

export default component$(() => {
  useAnonymousRoute();

  return (
    <div class="flex flex-col gap-2">
      <h1>Sign In</h1>
      <div class="flex flex-col gap-6">
        <GoogleForm />
        <MagicLinkForm />
        <PasswordForm />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
