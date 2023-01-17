import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";
import type { AuthResponse } from "@supabase/supabase-js";

type Props = {
  action: FormProps<AuthResponse>["action"];
};

export const PasswordForm = component$<Props>((props) => {
  return (
    <Form class="flex flex-col gap-2" action={props.action}>
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
      <pre>{JSON.stringify(props.action.value, null, 2)}</pre>
    </Form>
  );
});
