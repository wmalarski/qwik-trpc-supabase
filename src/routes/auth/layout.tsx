import { component$, Slot } from "@builder.io/qwik";
import { PublicHeader } from "~/modules/layout/PublicHeader/PublicHeader";

export default component$(() => {
  return (
    <>
      <PublicHeader />
      <section class="border-b-8 border-solid border-primary p-5">
        <Slot />
      </section>
    </>
  );
});
