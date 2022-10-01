import { component$ } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { Login } from "~/modules/Login/Login";
import { paths } from "~/utils/paths";

export const onGet: RequestHandler = async (ev) => {
  const { getUserByCookie } = await import("~/server/auth");

  const user = await getUserByCookie(ev.request);

  if (user) {
    throw ev.response.redirect(paths.board);
  }

  return;
};

export default component$(() => {
  useEndpoint();

  return <Login />;
});

export const head: DocumentHead = {
  title: "Login - Welcome to Qwik",
};
