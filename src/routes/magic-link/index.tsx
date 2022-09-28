import { component$, Resource, useClientEffect$ } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";

export const onGet: RequestHandler = (ev) => {
  const params = ev.url.hash;
  console.log("magic-link", params);

  // <script is:inline>
  //   const parseMagicLink = async (req) => {
  //     const vals = window.location.hash
  //       .substring(1)
  //       .split("&")
  //       .map((kv) => kv.split("="));

  //     const hashParameters = new Map(vals);

  //     const data = await fetch("/api/login", {
  //       method: "POST",
  //       headers: new Headers({ "Content-Type": "application/json" }),
  //       credentials: "same-origin",
  //       body: JSON.stringify({
  //         access_token: hashParameters.get("access_token"),
  //         expires_in: hashParameters.get("expires_in"),
  //         refresh_token: hashParameters.get("refresh_token"),
  //       }),
  //     });

  //     if (data.ok) {
  //       window.location.replace("/");
  //     }
  //   };
  //   parseMagicLink();
  // </script>

  return null;
};

export default component$(() => {
  const data = useEndpoint();

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
      <Resource
        value={data}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Error</div>}
        onResolved={() => <pre>11</pre>}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
