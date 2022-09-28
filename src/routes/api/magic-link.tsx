import { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = (ev) => {
  console.log("magic-link", ev);

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
