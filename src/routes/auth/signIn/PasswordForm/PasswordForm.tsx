import { component$, useTask$ } from "@builder.io/qwik";
import { Form, useNavigate } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { signInPassword } from "..";

export const PasswordForm = component$(() => {
  const navigate = useNavigate();

  const action = signInPassword.use();

  useTask$(({ track }) => {
    const status = track(() => action.value?.status);

    if (status !== "success") {
      return;
    }

    navigate(paths.index);
  });

  return (
    <Form class="flex flex-col gap-2" action={action}>
      <h2 class="text-xl">Sign in with password</h2>

      <div class="form-control w-full">
        <label for="email" class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          class="input input-bordered w-full"
          id="email"
          placeholder="Email"
          name="email"
          type="email"
        />
      </div>

      <div class="form-control w-full">
        <label for="password" class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          id="password"
          class="input input-bordered w-full"
          name="password"
          type="password"
        />
      </div>

      <button class="btn btn-primary mt-2" type="submit">
        Sign In
      </button>
      <pre>{JSON.stringify(action.value, null, 2)}</pre>
    </Form>
  );
});
