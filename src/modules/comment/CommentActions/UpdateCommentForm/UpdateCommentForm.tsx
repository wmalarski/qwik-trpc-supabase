import { component$, useStore } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { trpc } from "~/utils/trpc";
import { CommentForm } from "../../CommentForm/CommentForm";

type State = {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  comment: Comment;
};

export const UpdateCommentForm = component$((props: Props) => {
  const state = useStore<State>({ isOpen: false, status: "idle" });

  return (
    <>
      <button
        class="btn"
        onClick$={() => {
          state.isOpen = !state.isOpen;
        }}
      >
        Edit
      </button>

      {state.isOpen && (
        <>
          <CommentForm
            isLoading={state.status === "loading"}
            onSubmit$={async (data) => {
              try {
                state.status = "loading";
                await trpc.comment.create.mutate({
                  parentId: props.comment.parentId,
                  postId: props.comment.postId,
                  text: data.text,
                });
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
