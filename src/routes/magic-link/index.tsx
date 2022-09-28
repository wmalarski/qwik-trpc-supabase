import { component$, useClientEffect$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  useClientEffect$(async () => {
    const hash = window.location.hash.substring(1);
    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);

    const data = await fetch("/api/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({
        access_token: params.get("access_token"),
        expires_in: params.get("expires_in"),
        refresh_token: params.get("refresh_token"),
      }),
    });

    if (data.ok) {
      window.location.replace("/");
    }
  });

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
