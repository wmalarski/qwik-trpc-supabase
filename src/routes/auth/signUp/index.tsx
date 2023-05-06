import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getUserFromEvent } from "~/server/auth/auth";
import { paths } from "~/utils/paths";
import { RegisterForm } from "./RegisterForm/RegisterForm";

export const useAnonymousRoute = routeLoader$(async (event) => {
  const user = await getUserFromEvent(event);

  if (user) {
    throw event.redirect(302, paths.index);
  }

  return user;
});

export default component$(() => {
  useAnonymousRoute();

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
