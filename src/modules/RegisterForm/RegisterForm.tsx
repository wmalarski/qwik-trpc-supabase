import { component$, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";

type RegisterFormState = {
  status: "idle" | "loading" | "success" | "error";
};

export const RegisterForm = component$(() => {
  const state = useStore<RegisterFormState>({ status: "idle" });

  return (
    <div>
      <h3>Sign Up</h3>
      <form
        preventDefault:submit
        method="post"
        onSubmit$={async (event) => {
          const form = new FormData(event.target as HTMLFormElement);
          const email = (form.get("email") as string) || "";
          const password = (form.get("password") as string) || "";
          try {
            state.status = "loading";
            await trpc.auth.signUp.mutate({ email, password });
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
