import { component$ } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { removeAuthCookies } from "~/server/auth";
import { paths } from "~/utils/paths";

export const onGet: RequestHandler = (ev) => {
  removeAuthCookies(ev.response);

  throw ev.response.redirect(paths.index);
};

export default component$(() => {
  useEndpoint();

  return <span>Logout</span>;
});

export const head: DocumentHead = {
  title: "Login - Welcome to Qwik",
};
