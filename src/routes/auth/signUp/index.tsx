import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { withUser } from "~/server/auth/withUser";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { RegisterForm } from "./RegisterForm/RegisterForm";

export const onGet = endpointBuilder()
  .use(withUser())
  .resolver(({ user, response }) => {
    if (user) {
      throw response.redirect(paths.index);
    }
  });

export default component$(() => {
  return (
    <div class="flex flex-col gap-2">
      <h1>Sign Up</h1>
      <RegisterForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Welcome to Qwik",
};
