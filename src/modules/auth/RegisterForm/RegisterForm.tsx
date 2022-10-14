import { component$, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

export const RegisterForm = component$(() => {
  const state = useStore<State>({ status: "idle" });

  return (
    <form
      class="flex flex-col gap-2"
      preventdefault:submit
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
      <h2 class="text-xl">Sign up with password</h2>

      <div class="form-control w-full">
        <label for="email" class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          class="input input-bordered w-full"
          placeholder="Email"
          id="email"
          name="email"
          type="email"
        />
      </div>

      <div class="form-control w-full">
        <label for="password" class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          class="input input-bordered w-full"
          id="password"
          name="password"
          type="password"
        />
      </div>

      <button
        class={{
          "btn btn-primary mt-2": true,
          loading: state.status === "loading",
        }}
        type="submit"
      >
        Sign Up
      </button>

      {state.status === "success" ? (
        <span>Success</span>
      ) : state.status === "error" ? (
        <span>Error</span>
      ) : null}
    </form>
  );
});
