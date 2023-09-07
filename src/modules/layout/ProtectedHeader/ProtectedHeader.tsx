import { component$ } from "@builder.io/qwik";
import { Form, Link } from "@builder.io/qwik-city";
import { QwikLogo } from "~/components/QwikIcon/QwikIcon";
import { useSupabaseSignOut } from "~/routes/plugin@supabase";
import { paths } from "~/utils/paths";

export const ProtectedHeader = component$(() => {
  const signOut = useSupabaseSignOut();

  return (
    <header class="flex w-full flex-row items-center justify-between gap-4 border-b-8 border-solid border-secondary bg-white p-2">
      <div class="pl-4">
        <Link href={paths.index}>
          <QwikLogo />
        </Link>
      </div>
      <ul class="menu menu-horizontal p-0">
        <li class="marker:accent-current">
          <Link href={paths.board}>Board</Link>
        </li>
      </ul>
      <Form action={signOut}>
        <button class="btn">Sign Out</button>
      </Form>
    </header>
  );
});
