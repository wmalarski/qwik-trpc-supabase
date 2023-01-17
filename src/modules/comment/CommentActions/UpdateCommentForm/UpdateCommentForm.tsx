import { component$, useSignal } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { CommentForm } from "../../CommentForm/CommentForm";

type Props = {
  comment: Comment;
  action: FormProps<void>["action"];
};

export const UpdateCommentForm = component$<Props>((props) => {
  const isOpen = useSignal(false);

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
            action={props.action}
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
