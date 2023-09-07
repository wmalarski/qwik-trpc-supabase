import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ProtectedHeader } from "~/modules/layout/ProtectedHeader/ProtectedHeader";
import { paths } from "~/utils/paths";
import { getSupabaseSession } from "../plugin@supabase";

export const useProtectedRoute = routeLoader$((event) => {
  const session = getSupabaseSession(event);

  if (!session) {
    throw event.redirect(302, paths.signIn);
  }

  return session;
});

export default component$(() => {
  useProtectedRoute();
  return (
    <>
      <ProtectedHeader />
      <section class="border-b-8 border-solid border-primary p-5">
        <Slot />
      </section>
    </>
  );
});
