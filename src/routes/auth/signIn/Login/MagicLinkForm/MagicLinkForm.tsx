import { component$ } from "@builder.io/qwik";
import type { AuthError } from "@supabase/supabase-js";

type Props = {
  error?: AuthError | null;
  isSuccess?: boolean;
};

export const MagicLinkForm = component$<Props>((props) => {
  return (
    <form class="flex flex-col gap-2" method="post">
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

      {props.isSuccess ? <span>Success</span> : null}
      {props.error ? <pre>{JSON.stringify(props.error, null, 2)}</pre> : null}
    </form>
  );
});
