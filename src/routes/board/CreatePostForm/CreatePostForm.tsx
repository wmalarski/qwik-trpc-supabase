import { component$ } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import { PostForm } from "~/modules/post/PostForm/PostForm";
import { protectedTrpcProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";

export const createPost = action$(
  protectedTrpcProcedure.action(async (form, { trpc, redirect }) => {
    const content = form.get("content") as string;

    const comment = await trpc.post.create({ content });

    throw redirect(302, paths.comment(comment.id));
  })
);

export const CreatePostForm = component$(() => {
  const action = createPost.use();

  return (
    <div>
      <PostForm isLoading={action.isPending} action={action} />
      {action.status === 200 ? (
        <span>Success</span>
      ) : typeof action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
