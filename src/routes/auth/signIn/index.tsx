import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { updateAuthCookies } from "~/server/auth/auth";
import { userProcedure, userTrpcProcedure } from "~/server/procedures";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";
import { Login } from "./Login/Login";

export const signIn = action$(
  userTrpcProcedure.action(async (form, { supabase, cookie, redirect }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string | undefined;

    if (!password) {
      const otpResult = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${getBaseUrl()}${paths.callback}` },
      });
      return { otpError: otpResult.error, otpSuccess: !otpResult.error };
    }

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (result.error || !result.data.session) {
      return { passError: result.error };
    }

    updateAuthCookies(result.data.session, cookie);

    throw redirect(302, paths.board);
  })
);

export const getData = loader$(
  userProcedure.loader((ev) => {
    if (ev.user) {
      throw ev.redirect(302, paths.index);
    }
  })
);

export default component$(() => {
  getData.use();

  const action = signIn.use();

  return (
    <Login
      passError={action.value?.passError}
      otpError={action.value?.otpError}
      otpIsSuccess={action.value?.otpSuccess}
    />
  );
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
