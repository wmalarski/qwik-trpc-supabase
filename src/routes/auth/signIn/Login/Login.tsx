import { component$ } from "@builder.io/qwik";
import type { AuthError } from "@supabase/supabase-js";
import { MagicLinkForm } from "./MagicLinkForm/MagicLinkForm";
import { PasswordForm } from "./PasswordForm/PasswordForm";

type Props = {
  error?: AuthError | null;
};

export const Login = component$<Props>((props) => {
  return (
    <div class="flex flex-col gap-2">
      <h1>Sign In</h1>
      <div class="flex flex-col gap-6">
        <MagicLinkForm />
        <PasswordForm error={props.error} />
      </div>
    </div>
  );
});
