import { component$ } from "@builder.io/qwik";
import { MagicLinkForm } from "./MagicLinkForm/MagicLinkForm";
import { PasswordForm } from "./PasswordForm/PasswordForm";

export const Login = component$(() => {
  return (
    <div>
      <MagicLinkForm />
      <PasswordForm />
    </div>
  );
});
