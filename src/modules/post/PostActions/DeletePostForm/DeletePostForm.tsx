import { component$ } from "@builder.io/qwik";
import { action$, Form } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { protectedTrpcProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";

export const deletePost = action$(
  protectedTrpcProcedure.action(async (form, { trpc, redirect }) => {
    const id = form.get("id") as string;

    await trpc.post.delete({ id });

    redirect(302, paths.board);
  })
);

type Props = {
  post: Post;
};

export const DeletePostForm = component$<Props>((props) => {
  const action = deletePost.use();

  return (
    <Form action={action}>
      <input type="hidden" name="id" value={props.post.id} />
      <button
        type="submit"
        class={{
          "btn btn-ghost btn-sm": true,
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
