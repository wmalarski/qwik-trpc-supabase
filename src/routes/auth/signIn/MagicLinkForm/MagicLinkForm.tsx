import { component$ } from "@builder.io/qwik";
import { Form, globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { createSupabase } from "~/server/auth/supabase";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";

export const useSignInOtpAction = globalAction$(
  async (data, event) => {
    const supabase = createSupabase(event);

    const result = await supabase.auth.signInWithOtp({
      email: data.email,
      options: { emailRedirectTo: `${getBaseUrl()}${paths.callback}` },
    });

    return result;
  },
  zod$({
    email: z.string().email(),
  })
);

export const MagicLinkForm = component$(() => {
  const action = useSignInOtpAction();

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
