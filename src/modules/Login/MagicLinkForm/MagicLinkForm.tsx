import { component$, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";

type MagicLinkFormState = {
  status: "idle" | "loading" | "success" | "error";
};

export const MagicLinkForm = component$(() => {
  const state = useStore<MagicLinkFormState>({ status: "idle" });

  return (
    <div>
      <h3>Send magic link</h3>
      <form
        preventDefault:submit
        method="post"
        onSubmit$={async (event) => {
          const form = new FormData(event.target as HTMLFormElement);
          const email = (form.get("email") as string) || "";
          try {
            state.status = "loading";
            await trpc.auth.sendMagicLink.mutate({ email });
            state.status = "success";
          } catch (error) {
            state.status = "error";
          }
        }}
      >
        <input name="email" type="email" />
        <input type="submit" />
        {state.status === "success" ? (
          <span>Success</span>
        ) : state.status === "error" ? (
          <span>Error</span>
        ) : null}
      </form>
    </div>
  );
});
