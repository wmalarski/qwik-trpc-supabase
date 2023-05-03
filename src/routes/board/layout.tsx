import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ProtectedHeader } from "~/modules/layout/ProtectedHeader/ProtectedHeader";
import { getUserFromEvent } from "~/server/auth/auth";
import { paths } from "~/utils/paths";

export const useProtectedRoute = routeLoader$(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) {
    event.redirect(302, paths.signIn);
  }

  return user;
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
