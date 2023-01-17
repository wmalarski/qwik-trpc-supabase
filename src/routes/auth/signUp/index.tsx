import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { userProcedure } from "~/server/procedures";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";
import { RegisterForm } from "./RegisterForm/RegisterForm";

export const getData = loader$(
  userProcedure.loader(({ user, redirect }) => {
    if (user) {
      throw redirect(302, paths.index);
    }
  })
);

export const signUp = action$(
  userProcedure.action(async (form, { supabase, redirect }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const emailRedirectTo = `${getBaseUrl()}${paths.callback}`;
    const result = await supabase.auth.signUp({
      email,
      options: { emailRedirectTo },
      password,
    });

    if (result.error) {
      return result;
    }

    throw redirect(302, paths.signIn);
  })
);

export default component$(() => {
  getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Sign Up</h1>
      <RegisterForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Welcome to Qwik",
};
