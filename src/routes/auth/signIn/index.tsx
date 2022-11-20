import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { withUser } from "~/server/auth/withUser";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { Login } from "./Login/Login";

export const onGet = endpointBuilder()
  .use(withUser())
  .resolver((ev) => {
    if (ev.user) {
      throw ev.response.redirect(paths.index);
    }
  });

export default component$(() => {
  return <Login />;
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
