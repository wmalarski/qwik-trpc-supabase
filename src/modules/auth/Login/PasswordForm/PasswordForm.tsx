import { component$, useStore } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";

type MagicLinkFormState = {
  status: "idle" | "loading" | "success" | "error";
};

export const PasswordForm = component$(() => {
  const state = useStore<MagicLinkFormState>({ status: "idle" });

  const navigate = useNavigate();

  return (
    <form
      class="flex flex-col gap-2"
      preventDefault:submit
      method="post"
      onSubmit$={async (event) => {
        const form = new FormData(event.target as HTMLFormElement);
        try {
          state.status = "loading";
          await fetch(paths.signUp, {
            body: JSON.stringify({
              email: form.get("email"),
              password: form.get("password"),
            }),
            credentials: "same-origin",
            headers: new Headers({ "Content-Type": "application/json" }),
            method: "POST",
          });
          state.status = "success";
          navigate.path = paths.index;
        } catch (error) {
          state.status = "error";
        }
      }}
    >
      <h2 class="text-xl">Sign in with password</h2>

      <div class="form-control w-full">
        <label htmlFor="text" class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          class="input input-bordered w-full"
          placeholder="Email"
          name="email"
          type="email"
        />
      </div>

      <div class="form-control w-full">
        <label htmlFor="text" class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          class="input input-bordered w-full"
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
        Sign In
      </button>

      {state.status === "success" ? (
        <span>Success</span>
      ) : state.status === "error" ? (
        <span>Error</span>
      ) : null}
    </form>
  );
});
