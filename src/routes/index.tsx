import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { MagicLinkForm } from "~/modules/MagicLinkForm/MagicLinkForm";

export default component$(() => {
  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <MagicLinkForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
