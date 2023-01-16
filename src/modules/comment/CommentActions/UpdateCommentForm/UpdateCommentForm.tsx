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
  onSuccess$: PropFunction<(comment: Comment) => void>;
};

export const UpdateCommentForm = component$<Props>((props) => {
  const onSuccess$ = props.onSuccess$;

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
                await trpc?.comment.update.mutate({
                  id: props.comment.id,
                  text: content,
                });
                onSuccess$({ ...props.comment, content });
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
