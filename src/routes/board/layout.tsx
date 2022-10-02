import { component$, Slot } from "@builder.io/qwik";
import { ProtectedHeader } from "~/modules/layout/ProtectedHeader/ProtectedHeader";

export default component$(() => {
  return (
    <>
      <ProtectedHeader />
      <section class="border-b-8 border-solid border-primary p-5">
        <Slot />
      </section>
    </>
  );
});
