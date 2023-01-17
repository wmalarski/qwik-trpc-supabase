import { component$ } from "@builder.io/qwik";
import { action$, Form } from "@builder.io/qwik-city";
import { userProcedure } from "~/server/procedures";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";

export const signUp = action$(
  userProcedure.action(async (form, { supabase, redirect }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    console.log({ email, password });

    const emailRedirectTo = `${getBaseUrl()}${paths.callback}`;
    const result = await supabase.auth.signUp({
      email,
      options: { emailRedirectTo },
      password,
    });

    console.log(result);

    if (result.error) {
      return result;
    }

    throw redirect(302, paths.signIn);
  })
);

export const RegisterForm = component$(() => {
  const action = signUp.use();

  console.log({ action });

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
      <pre>{JSON.stringify(action.value?.error, null, 2)}</pre>
    </Form>
  );
});
