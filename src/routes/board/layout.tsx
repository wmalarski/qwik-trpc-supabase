import { component$, Slot } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import { ProtectedHeader } from "~/modules/layout/ProtectedHeader/ProtectedHeader";
import { getUserFromEvent } from "~/server/loaders";
import { paths } from "~/utils/paths";

export const getProtectedUser = loader$(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) {
    throw event.redirect(302, paths.signIn);
  }
});

export default component$(() => {
  getProtectedUser.use();
  return (
    <>
      <ProtectedHeader />
      <section class="border-b-8 border-solid border-primary p-5">
        <Slot />
      </section>
    </>
  );
});
