import { component$ } from "@builder.io/qwik";
import type { DocumentHead, RequestEvent } from "@builder.io/qwik-city";
import { removeAuthCookies } from "~/server/auth/auth";
import { paths } from "~/utils/paths";

export const onGet = (event: RequestEvent) => {
  removeAuthCookies(event);

  throw event.redirect(302, paths.index);
};

export default component$(() => {
  return <span>Bye</span>;
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
