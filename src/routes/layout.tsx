import { component$, Slot } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import { getUserByCookie } from "~/server/auth/auth";
import { useTrpcContextProvider } from "./context";

export const getUser = loader$(async (event) => {
  console.log("getUser", event.url.href);

  const result = await getUserByCookie(event.cookie);

  console.log("getUser", event.url.href, { result });

  return result?.user || null;
});

export default component$(() => {
  useTrpcContextProvider();

  getUser.use();

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
