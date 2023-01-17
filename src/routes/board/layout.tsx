import { component$, Slot } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import { ProtectedHeader } from "~/modules/layout/ProtectedHeader/ProtectedHeader";
import { supabase } from "~/server/auth/auth";
import { prisma } from "~/server/db/client";
import { appRouter } from "~/server/trpc/router";
import { getUser } from "../layout";

export const getTrpc = loader$(async (event) => {
  console.log("getTrpc", event.url.href);

  const user = await event.getData(getUser);

  console.log("getTrpc", event.url.href, { user });

  // if (!user) {
  //   throw event.redirect(302, paths.signIn);
  // }

  const trpc = appRouter.createCaller({
    prisma,
    supabase: supabase,
    user,
  });

  console.log("getTrpc", event.url.href, { trpc });

  return trpc;
});

export default component$(() => {
  return (
    <>
      <ProtectedHeader />
      <section class="border-b-8 border-solid border-primary p-5">
        <Slot />
      </section>
    </>
  );
});
