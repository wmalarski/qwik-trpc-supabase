import { component$, Slot } from "@builder.io/qwik";
import Header from "../modules/Header/Header";

export default component$(() => {
  return (
    <>
      <main class="mx-auto max-w-3xl overflow-hidden rounded-md bg-white shadow-xl">
        <Header />
        <section class="border-b-8 border-solid border-primary p-5">
          <Slot />
        </section>
      </main>
      <footer class="p-4 text-center text-xs">
        <a class="link" href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
        </a>
      </footer>
    </>
  );
});
