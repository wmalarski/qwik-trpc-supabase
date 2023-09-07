import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getSupabaseSession } from "~/routes/plugin@supabase";
import { paths } from "~/utils/paths";
import { RegisterForm } from "./RegisterForm/RegisterForm";

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
      <h1>Sign Up</h1>
      <RegisterForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Welcome to Qwik",
};
