import { component$, PropFunction, useStore } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { useTrpcContext } from "~/routes/context";
import { CommentForm } from "../../CommentForm/CommentForm";

type State = {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  comment: Comment;
  onSuccess$?: PropFunction<() => void>;
};

export const UpdateCommentForm = component$<Props>((props) => {
  const onSuccess$ = props.onSuccess$;
  const parentId = props.comment.parentId;
  const postId = props.comment.postId;

  const state = useStore<State>({ isOpen: false, status: "idle" });
  const trpcContext = useTrpcContext();
  const isLoading = state.status === "loading";

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
            initialValue={props.comment}
            isLoading={isLoading}
            onSubmit$={async ({ content }) => {
              try {
                state.status = "loading";
                const trpc = await trpcContext();
                await trpc?.comment.create.mutate({
                  parentId,
                  postId,
                  text: content,
                });
                onSuccess$?.();
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
