import { component$ } from "@builder.io/qwik";
import { action$, Form, z, zod$ } from "@builder.io/qwik-city";
import { supabase, updateAuthCookies } from "~/server/auth/auth";
import { paths } from "~/utils/paths";

export const signInPassword = action$(
  async (data, event) => {
    const result = await supabase.auth.signInWithPassword(data);

    if (result.error || !result.data.session) {
      return { status: "error" };
    }

    updateAuthCookies(event, result.data.session);

    event.redirect(302, paths.index);
  },
  zod$({
    email: z.string().email(),
    password: z.string(),
  })
);

export const PasswordForm = component$(() => {
  const action = signInPassword.use();

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
