import { component$ } from "@builder.io/qwik";
import { action$, Form } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { protectedTrpcProcedure } from "~/server/procedures";

export const deleteComment = action$(
  protectedTrpcProcedure.action(async (form, { trpc }) => {
    const id = form.get("id") as string;
    await trpc.comment.delete({ id });
  })
);

type Props = {
  comment: Comment;
};

export const DeleteCommentForm = component$<Props>((props) => {
  const action = deleteComment.use();

  return (
    <Form action={action}>
      <input type="hidden" name="id" value={props.comment.id} />
      <button
        type="submit"
        class={{
          "btn btn-ghost mt-2": true,
          loading: action.isPending,
        }}
      >
        Remove
      </button>

      {action.status === 200 ? (
        <span>Success</span>
      ) : typeof action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </Form>
  );
});
