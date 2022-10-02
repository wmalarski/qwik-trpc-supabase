import { component$ } from "@builder.io/qwik";
import { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Login } from "~/modules/auth/Login/Login";
import { paths } from "~/utils/paths";

export const onGet: RequestHandler = async (ev) => {
  const { getUserByCookie } = await import("~/server/auth");

  const user = await getUserByCookie(ev.request);

  if (user) {
    throw ev.response.redirect(paths.index);
  }
};

export default component$(() => {
  return <Login />;
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
