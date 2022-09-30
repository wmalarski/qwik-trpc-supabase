import { component$, useStore } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";

type MagicLinkFormState = {
  status: "idle" | "loading" | "success" | "error";
};

export const onPost: RequestHandler = (ev) => {
  console.log({ ev });
};

export const PasswordForm = component$(() => {
  const state = useStore<MagicLinkFormState>({ status: "idle" });

  return (
    <div>
      <h3>Password form</h3>
      <form method="post">
        <input name="email" type="email" />
        <input name="password" type="password" />
        <input type="submit" />
        {state.status === "success" ? (
          <span>Success</span>
        ) : state.status === "error" ? (
          <span>Error</span>
        ) : null}
      </form>
    </div>
  );
});
