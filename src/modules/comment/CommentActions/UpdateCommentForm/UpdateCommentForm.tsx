import { component$, useSignal } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { protectedTrpcProcedure } from "~/server/procedures";
import { CommentForm } from "../../CommentForm/CommentForm";

export const updateComment = action$(
  protectedTrpcProcedure.action(async (form, { trpc }) => {
    const id = form.get("id") as string;
    const text = form.get("text") as string;

    await trpc.comment.update({ id, text });
  })
);

type Props = {
  comment: Comment;
};

export const UpdateCommentForm = component$<Props>((props) => {
  const action = updateComment.use();

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
            isLoading={action.isPending}
            action={action}
          />

          {action.status === 200 ? (
            <span>Success</span>
          ) : typeof action.status !== "undefined" ? (
            <span>Error</span>
          ) : null}
        </>
      )}
    </>
  );
});
