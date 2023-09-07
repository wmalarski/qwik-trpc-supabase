import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useSupabaseSignInWithOtp } from "~/routes/plugin@supabase";

export const MagicLinkForm = component$(() => {
  const action = useSupabaseSignInWithOtp();

  return (
    <Form class="flex flex-col gap-2" action={action}>
      <h2 class="text-xl">Send magic link</h2>

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
        <span class="label text-red-500">{JSON.stringify(action.value)}</span>
      </div>

      <span class="label text-red-500">{action.value?.formErrors?.[0]}</span>
      <button class="btn btn-primary mt-2" type="submit">
        Send
      </button>
    </Form>
  );
});
