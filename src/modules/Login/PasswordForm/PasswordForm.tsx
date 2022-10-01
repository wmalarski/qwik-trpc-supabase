import { component$, useStore } from "@builder.io/qwik";
import { paths } from "~/utils/paths";

type MagicLinkFormState = {
  status: "idle" | "loading" | "success" | "error";
};

export const PasswordForm = component$(() => {
  const state = useStore<MagicLinkFormState>({ status: "idle" });

  return (
    <div>
      <h3>Password form</h3>
      <form
        preventDefault:submit
        method="post"
        onSubmit$={async (event) => {
          const form = new FormData(event.target as HTMLFormElement);
          try {
            state.status = "loading";
            await fetch(paths.signUp, {
              method: "POST",
              headers: new Headers({ "Content-Type": "application/json" }),
              credentials: "same-origin",
              body: JSON.stringify({
                email: form.get("email"),
                password: form.get("password"),
              }),
            });
            state.status = "success";
          } catch (error) {
            state.status = "error";
          }
        }}
      >
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
