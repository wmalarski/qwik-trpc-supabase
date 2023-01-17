import { component$, useSignal } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { protectedTrpcProcedure } from "~/server/procedures";
import { PostForm } from "../../PostForm/PostForm";

export const updatePost = action$(
  protectedTrpcProcedure.action(async (form, { trpc }) => {
    const id = form.get("id") as string;
    const content = form.get("content") as string;

    await trpc.post.update({ content, id });
  })
);

type Props = {
  post: Post;
};

export const UpdatePostForm = component$<Props>((props) => {
  const action = updatePost.use();

  const isOpen = useSignal(false);

  return (
    <>
      <button
        class="btn btn-ghost btn-sm"
        onClick$={() => {
          isOpen.value = !isOpen.value;
        }}
      >
        Edit
      </button>

      {isOpen.value && (
        <>
          <PostForm
            initialValue={props.post}
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
