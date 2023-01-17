import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";
import type { AuthResponse } from "@supabase/supabase-js";

type Props = {
  action: FormProps<AuthResponse>["action"];
};

export const MagicLinkForm = component$<Props>((props) => {
  return (
    <Form class="flex flex-col gap-2" action={props.action}>
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

      {props.action.status === 200 ? <span>Success</span> : null}
      {props.action.status !== 200 ? (
        <pre>{JSON.stringify(props.action.value, null, 2)}</pre>
      ) : null}
    </Form>
  );
});
