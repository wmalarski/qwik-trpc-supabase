import { $, component$, useClientEffect$ } from "@builder.io/qwik";
import { action$, DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { z } from "zod";
import { updateAuthCookies } from "~/server/auth/auth";
import { paths } from "~/utils/paths";

export const setSession = action$((form, event) => {
  const input = Object.fromEntries(form.entries());

  const parsed = z
    .object({
      access_token: z.string(),
      expires_in: z.coerce.number(),
      refresh_token: z.string(),
    })
    .safeParse(input);

  if (!parsed.success) {
    return { status: "error" };
  }

  updateAuthCookies(parsed.data, event.cookie);

  return { status: "success" };
});

export default component$(() => {
  const navigate = useNavigate();

  const action = setSession.use();

  useClientEffect$(() => {
    // This is triggering container to startup
    // and then actions are working as expected
    // needs to be debugged more
    document.getElementById("callback-button")?.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
  });

  const handleSendSession = $(async () => {
    const hash = window.location.hash.substring(1);

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const expires_in = params.get("expires_in");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !expires_in || !refresh_token) {
      return;
    }

    await action.execute({
      access_token,
      expires_in,
      refresh_token,
    });

    if (action.value?.status !== "success") {
      return;
    }

    navigate(paths.index);
  });

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <button
        aria-hidden
        class="hidden"
        id="callback-button"
        onClick$={handleSendSession}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
