import { component$ } from "@builder.io/qwik";
import { action$, Form, z, zod$ } from "@builder.io/qwik-city";
import { supabase } from "~/server/auth/auth";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";

export const signUp = action$(
  async (data) => {
    const emailRedirectTo = `${getBaseUrl()}${paths.callback}`;
    const result = await supabase.auth.signUp({
      ...data,
      options: { emailRedirectTo },
    });

    if (result.error) {
      return { status: "error" };
    }
  },
  zod$({
    email: z.string().email(),
    password: z.string(),
  })
);

export const RegisterForm = component$(() => {
  const action = signUp.use();

  return (
    <Form class="flex flex-col gap-2" action={action}>
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

      <button class={"btn btn-primary mt-2"} type="submit">
        Sign Up
      </button>

      <pre>{JSON.stringify({ status: action.status }, null, 2)}</pre>
      <pre>{JSON.stringify(action.value, null, 2)}</pre>
    </Form>
  );
});
