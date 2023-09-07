import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useSupabaseSignUp } from "~/routes/plugin@supabase";

export const RegisterForm = component$(() => {
  const signUp = useSupabaseSignUp();

  return (
    <Form class="flex flex-col gap-2" action={signUp}>
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
        <span class="label text-red-500">
          {signUp.value?.fieldErrors?.email?.[0]}
        </span>
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
        <span class="label text-red-500">
          {signUp.value?.fieldErrors?.password?.[0]}
        </span>
      </div>

      <span class="label text-red-500">{signUp.value?.formErrors?.[0]}</span>
      <button class={"btn btn-primary mt-2"} type="submit">
        Sign Up
      </button>
    </Form>
  );
});
