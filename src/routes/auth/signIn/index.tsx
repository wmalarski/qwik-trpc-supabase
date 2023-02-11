import { component$ } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getUserFromEvent } from "~/server/loaders";
import { paths } from "~/utils/paths";
import { MagicLinkForm } from "./MagicLinkForm/MagicLinkForm";
import { PasswordForm } from "./PasswordForm/PasswordForm";

export const getData = loader$(async (event) => {
  const user = await getUserFromEvent(event);

  if (user) {
    event.redirect(302, paths.index);
  }
});

export default component$(() => {
  getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Sign In</h1>
      <div class="flex flex-col gap-6">
        <MagicLinkForm />
        <PasswordForm />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
