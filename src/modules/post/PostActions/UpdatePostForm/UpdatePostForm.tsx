import { component$, useSignal } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import type { Post } from "~/server/db/types";
import { trpcAction } from "~/server/trpc/action";
import { useTrpcAction } from "~/utils/trpc";
import { PostForm } from "../../PostForm/PostForm";

export const trpc = action$((data, event) => trpcAction(data, event));

type Props = {
  post: Post;
};

export const UpdatePostForm = component$<Props>((props) => {
  const isOpen = useSignal(false);

  const action = useTrpcAction(trpc.use()).post.update();

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
