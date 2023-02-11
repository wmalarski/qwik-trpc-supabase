import { component$ } from "@builder.io/qwik";
import { action$, Form, z, zod$ } from "@builder.io/qwik-city";
import { supabase } from "~/server/auth/auth";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";

export const signInOtp = action$(
  (data) => {
    return supabase.auth.signInWithOtp({
      email: data.email,
      options: { emailRedirectTo: `${getBaseUrl()}${paths.callback}` },
    });
  },
  zod$({
    email: z.string().email(),
  })
);

export const MagicLinkForm = component$(() => {
  const action = signInOtp.use();

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
      </div>

      <button class="btn btn-primary mt-2" type="submit">
        Send
      </button>

      {action.status === 200 ? <span>Success</span> : null}
      {action.status !== 200 ? (
        <pre>{JSON.stringify(action.value, null, 2)}</pre>
      ) : null}
    </Form>
  );
});
