import { component$, useSignal } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { trpc } from "~/server/trpc/api";
import { PostForm } from "../../PostForm/PostForm";

export const useUpdatePostAction = trpc.post.update.action$();

type Props = {
  post: Post;
};

export const UpdatePostForm = component$<Props>((props) => {
  const isOpen = useSignal(false);

  const action = useUpdatePostAction();

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
            isLoading={action.isRunning}
            onSubmit$={async ({ content }) => {
              await action.run({ content, id: props.post.id });
              isOpen.value = false;
            }}
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
