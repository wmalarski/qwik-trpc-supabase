import { component$, useSignal } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { trpcAction$ } from "~/lib/qwik-trpc2";
import { PostForm } from "../../PostForm/PostForm";

export const useUpdatePostAction = trpcAction$(() => ["post", "update"]);

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
