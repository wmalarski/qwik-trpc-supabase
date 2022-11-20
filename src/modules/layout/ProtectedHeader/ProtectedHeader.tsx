import { component$ } from "@builder.io/qwik";
import { QwikLogo } from "~/components/QwikIcon/QwikIcon";
import { paths } from "~/utils/paths";

export const ProtectedHeader = component$(() => {
  return (
    <header class="flex w-full flex-row items-center justify-between gap-4 border-b-8 border-solid border-secondary bg-white p-2">
      <div class="pl-4">
        <a href={paths.index}>
          <QwikLogo />
        </a>
      </div>
      <ul class="menu menu-horizontal p-0">
        <li class="marker:accent-current">
          <a href={paths.board}>Board</a>
        </li>
        <li class="marker:accent-current">
          <a href={paths.signOut}>Sign Out</a>
        </li>
      </ul>
    </header>
  );
});
