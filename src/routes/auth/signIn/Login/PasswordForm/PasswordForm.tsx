import { component$ } from "@builder.io/qwik";
import { AuthError } from "@supabase/supabase-js";

type Props = {
  error?: AuthError | null;
};

export const PasswordForm = component$<Props>((props) => {
  return (
    <form class="flex flex-col gap-2" method="post">
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
      <pre>{JSON.stringify(props.error, null, 2)}</pre>
    </form>
  );
});
