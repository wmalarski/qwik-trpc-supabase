import { component$ } from "@builder.io/qwik";
import { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { removeAuthCookies } from "~/server/auth";
import { paths } from "~/utils/paths";

export const onGet: RequestHandler = (ev) => {
  removeAuthCookies(ev.response);

  throw ev.response.redirect(paths.index);
};

export default component$(() => {
  return <span>Bye</span>;
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
