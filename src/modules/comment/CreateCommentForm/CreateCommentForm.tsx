import { component$ } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import { protectedTrpcProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";
import { CommentForm } from "../CommentForm/CommentForm";

export const createComment = action$(
  protectedTrpcProcedure.action(async (form, { trpc, redirect }) => {
    const text = form.get("text") as string;
    const parentId = form.get("parentId") as string;
    const postId = form.get("postId") as string;

    const comment = await trpc.comment.create({
      parentId,
      postId,
      text,
    });

    throw redirect(302, paths.comment(comment.id));
  })
);

type Props = {
  parentId: string | null;
  postId: string;
};

export const CreateCommentForm = component$<Props>((props) => {
  const action = createComment.use();

  return (
    <div>
      <CommentForm
        isLoading={action.isPending}
        initialValue={{ parentId: props.parentId, postId: props.postId }}
        action={action}
      />

      {action.status === 200 ? (
        <span>Success</span>
      ) : typeof action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
