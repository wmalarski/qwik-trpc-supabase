import { component$, PropFunction, useStore } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { trpc } from "~/utils/trpc";
import { PostForm } from "../../PostForm/PostForm";

type State = {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  onSuccess$?: PropFunction<() => void>;
  post: Post;
};

export const UpdatePostForm = component$((props: Props) => {
  const state = useStore<State>({ isOpen: false, status: "idle" });
  const isLoading = state.status === "loading";

  return (
    <>
      <button
        class="btn btn-ghost btn-sm"
        onClick$={() => {
          state.isOpen = !state.isOpen;
        }}
      >
        Edit
      </button>

      {state.isOpen && (
        <>
          <PostForm
            initialValue={props.post}
            isLoading={isLoading}
            onSubmit$={async ({ content }) => {
              try {
                state.status = "loading";
                await trpc.post.update.mutate({
                  id: props.post.id,
                  text: content,
                });
                props.onSuccess$?.();
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
        </>
      )}
    </>
  );
});
