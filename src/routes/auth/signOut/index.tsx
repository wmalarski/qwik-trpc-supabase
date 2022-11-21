import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { removeAuthCookies } from "~/server/auth/auth";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";

export const onGet = endpointBuilder().resolver(({ cookie, response }) => {
  removeAuthCookies(cookie);

  throw response.redirect(paths.index);
});

export default component$(() => {
  return <span>Bye</span>;
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
