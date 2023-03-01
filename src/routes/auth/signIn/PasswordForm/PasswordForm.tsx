import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { supabase, updateAuthCookies } from "~/server/auth/auth";
import { paths } from "~/utils/paths";

export const useSignInPasswordAction = routeAction$(
  async (data, event) => {
    const result = await supabase.auth.signInWithPassword(data);

    if (result.error || !result.data.session) {
      const status = result.error?.status || 400;
      return event.fail(status, {
        formErrors: [result.error?.message],
      });
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
  const action = useSignInPasswordAction();

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
        <span class="label text-red-500">
          {action.value?.fieldErrors?.email?.[0]}
        </span>
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
        <span class="label text-red-500">
          {action.value?.fieldErrors?.password?.[0]}
        </span>
      </div>

      <span class="label text-red-500">{action.value?.formErrors?.[0]}</span>
      <button class="btn btn-primary mt-2" type="submit">
        Sign In
      </button>
    </Form>
  );
});
