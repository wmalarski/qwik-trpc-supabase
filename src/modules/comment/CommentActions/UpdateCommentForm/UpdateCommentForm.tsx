import { component$, useSignal } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { actionTrpc } from "~/routes/plugin@trpc";
import { CommentForm } from "../../CommentForm/CommentForm";

export const useUpdateCommentAction = actionTrpc.comment.update.globalAction$();

type Props = {
  comment: Comment;
};

export const UpdateCommentForm = component$<Props>((props) => {
  const isOpen = useSignal(false);

  const action = useUpdateCommentAction();

  return (
    <>
      <button
        class="btn"
        onClick$={() => {
          isOpen.value = !isOpen.value;
        }}
      >
        Edit
      </button>

      {isOpen.value && (
        <>
          <CommentForm
            initialValue={props.comment}
            isLoading={action.isRunning}
            onSubmit$={async ({ content }) => {
              await action.submit({ content, id: props.comment.id });
              isOpen.value = false;
            }}
          />

          {action.value?.status === "success" ? (
            <span>Success</span>
          ) : action.value?.status === "error" ? (
            <pre>{JSON.stringify(action.value, null, 2)}</pre>
          ) : null}
        </>
      )}
    </>
  );
});
