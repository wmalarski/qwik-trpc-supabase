import { component$ } from "@builder.io/qwik";
import { DocumentHead, Link } from "@builder.io/qwik-city";
import { MagicLinkForm } from "~/modules/MagicLinkForm/MagicLinkForm";

export default component$(() => {
  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <Link href="/board">Board</Link>
      <MagicLinkForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
