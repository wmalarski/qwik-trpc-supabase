import { component$, mutable, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";
import { PostForm } from "../PostForm/PostForm";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

export const CreatePostForm = component$(() => {
  const state = useStore<State>({ status: "idle" });
  const isLoading = state.status === "loading";

  return (
    <div>
      <PostForm
        isLoading={mutable(isLoading)}
        onSubmit$={async ({ content }) => {
          try {
            state.status = "loading";
            await trpc.post.create.mutate({ text: content });
            state.status = "success";
          } catch (error) {
            state.status = "error";
          }
        }}
      />

      {state.status === "success" ? (
        <span>Success</span>
      ) : state.status === "error" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
