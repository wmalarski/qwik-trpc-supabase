import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import styles from "./Header.css?inline";
import { QwikLogo } from "./QwikIcon/QwikIcon";

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <div class="logo">
        <a href={paths.index}>
          <QwikLogo />
        </a>
      </div>
      <ul>
        <li>
          <Link href={paths.board}>Board</Link>
        </li>
        <li>
          <Link href={paths.login}>Login</Link>
        </li>
        <li>
          <Link href={paths.logout}>Logout</Link>
        </li>
      </ul>
    </header>
  );
});
