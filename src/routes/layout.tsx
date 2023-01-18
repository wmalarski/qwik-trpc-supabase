import { component$, Slot } from "@builder.io/qwik";
import { useTrpcContextProvider } from "./context";

export default component$(() => {
  useTrpcContextProvider();

  return (
    <>
      <main class="mx-auto max-w-3xl overflow-hidden rounded-md bg-white shadow-xl">
        <Slot />
      </main>
      <footer class="p-4 text-center text-xs">
        <a class="link" href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
        </a>
      </footer>
    </>
  );
});
