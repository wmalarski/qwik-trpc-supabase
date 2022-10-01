import { component$, Slot } from "@builder.io/qwik";
import Header from "../modules/Header/Header";

export default component$(() => {
  return (
    <>
      <main class="max-w-3xl mx-auto rounded-md shadow-xl overflow-hidden bg-white">
        <Header />
        <section class="p-5 border-b-8 border-primary border-solid">
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
