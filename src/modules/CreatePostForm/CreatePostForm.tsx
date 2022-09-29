import { component$, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";

type CreatePostFormState = {
  status: "idle" | "loading" | "success" | "error";
};

export const CreatePostForm = component$(() => {
  const state = useStore<CreatePostFormState>({ status: "idle" });

  return (
    <form
      preventDefault:submit
      method="post"
      onSubmit$={async (event) => {
        const form = new FormData(event.target as HTMLFormElement);
        const text = (form.get("text") as string) || "";
        try {
          state.status = "loading";
          await trpc.post.add.mutate({ text });
          state.status = "success";
        } catch (error) {
          state.status = "error";
        }
      }}
    >
      <input name="text" type="text" />
      <input type="submit" />
      {state.status === "success" ? (
        <span>Success</span>
      ) : state.status === "error" ? (
        <span>Error</span>
      ) : null}
    </form>
  );
});
