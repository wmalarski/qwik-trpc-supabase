import { component$ } from "@builder.io/qwik";
import { Form, globalAction$ } from "@builder.io/qwik-city";
import { createSupabase } from "~/server/auth/supabase";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";

export const useSignInGoogleAction = globalAction$(async (_data, event) => {
  const supabase = createSupabase(event);

  const result = await supabase.auth.signInWithOAuth({
    options: { redirectTo: `${getBaseUrl()}${paths.callback}` },
    provider: "google",
  });

  const redirectUrl = result.data.url;
  if (!redirectUrl) {
    throw event.error(400, "invalid request");
  }

  throw event.redirect(302, result.data.url);
});

export const GoogleForm = component$(() => {
  const action = useSignInGoogleAction();

  return (
    <Form class="flex flex-col gap-2" action={action}>
      <h2 class="text-xl">Login with google</h2>
      <button class="btn btn-primary" type="submit">
        Google
      </button>
    </Form>
  );
});
