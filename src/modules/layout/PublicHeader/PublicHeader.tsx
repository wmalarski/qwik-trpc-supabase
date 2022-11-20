import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "~/components/QwikIcon/QwikIcon";
import { paths } from "~/utils/paths";

export const PublicHeader = component$(() => {
  return (
    <header class="flex w-full flex-row items-center justify-between gap-4 border-b-8 border-solid border-secondary bg-white p-2">
      <div class="pl-4">
        <a href={paths.index}>
          <QwikLogo />
        </a>
      </div>
      <ul class="menu menu-horizontal p-0">
        <li class="marker:accent-current">
          <a href={paths.signIn}>Sign In</a>
        </li>
        <li class="marker:accent-current">
          <a href={paths.signUp}>Sign Up</a>
        </li>
      </ul>
    </header>
  );
});
