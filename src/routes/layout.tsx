import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <main class="mx-auto max-w-3xl overflow-hidden rounded-md bg-white shadow-xl">
        <Slot />
      </main>
      <footer class="p-4 text-center text-xs">
        <a class="link" href="https://github.com/wmalarski" target="_blank">
          Made with ♡ by wmalarski
        </a>
      </footer>
    </>
  );
});
