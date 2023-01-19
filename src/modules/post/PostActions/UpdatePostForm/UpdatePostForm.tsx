import { component$, useSignal } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Post } from "~/server/db/types";
import { useTrpcAction } from "~/utils/trpc";
import { PostForm } from "../../PostForm/PostForm";

type Props = {
  action: FormProps<void>["action"];
  post: Post;
};

export const UpdatePostForm = component$<Props>((props) => {
  const isOpen = useSignal(false);

  const action = useTrpcAction(props.action).post.update();

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
            isLoading={props.action.isPending}
            onSubmit$={async ({ content }) => {
              await action.execute({ content, id: props.post.id });
              isOpen.value = false;
            }}
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
