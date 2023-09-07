import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useSupabaseSignInWithOAuth } from "~/routes/plugin@supabase";

export const GoogleForm = component$(() => {
  const action = useSupabaseSignInWithOAuth();

  return (
    <Form class="flex flex-col gap-2" action={action}>
      <h2 class="text-xl">Login with google</h2>
      <input type="hidden" name="provider" value="google" />
      <button class="btn btn-primary" type="submit">
        Google
      </button>
    </Form>
  );
});
