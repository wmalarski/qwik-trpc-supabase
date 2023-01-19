import { component$, useSignal } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Comment } from "~/server/db/types";
import { useTrpcAction } from "~/utils/trpc";
import { CommentForm } from "../../CommentForm/CommentForm";

type Props = {
  comment: Comment;
  action: FormProps<Comment>["action"];
};

export const UpdateCommentForm = component$<Props>((props) => {
  const isOpen = useSignal(false);

  const action = useTrpcAction(props.action).comment.update();

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
            isLoading={props.action.isPending}
            onSubmit$={async ({ content }) => {
              await action.execute({ content, id: props.comment.id });
              isOpen.value = false;
            }}
          />

          {props.action.status === 200 ? (
            <span>Success</span>
          ) : typeof props.action.status !== "undefined" ? (
            <span>Error</span>
          ) : null}
        </>
      )}
    </>
  );
});
