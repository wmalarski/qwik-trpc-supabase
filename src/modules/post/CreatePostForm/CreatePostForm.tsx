import { component$, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";
import { PostForm } from "../PostForm/PostForm";

type CreatePostFormState = {
  status: "idle" | "loading" | "success" | "error";
};

export const CreatePostForm = component$(() => {
  const state = useStore<CreatePostFormState>({ status: "idle" });

  return (
    <div>
      <PostForm
        isLoading={state.status === "loading"}
        onSubmit$={async (data) => {
          try {
            state.status = "loading";
            await trpc.post.create.mutate({ text: data.text });
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
