import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { QwikLogo } from "~/components/QwikIcon/QwikIcon";
import { paths } from "~/utils/paths";

export const PublicHeader = component$(() => {
  return (
    <header class="flex w-full flex-row items-center justify-between gap-4 border-b-8 border-solid border-secondary bg-white p-2">
      <div class="pl-4">
        <Link href={paths.index}>
          <QwikLogo />
        </Link>
      </div>
      <ul class="menu menu-horizontal p-0">
        <li class="marker:accent-current">
          <Link href={paths.signIn}>Sign In</Link>
        </li>
        <li class="marker:accent-current">
          <Link href={paths.signUp}>Sign Up</Link>
        </li>
      </ul>
    </header>
  );
});
