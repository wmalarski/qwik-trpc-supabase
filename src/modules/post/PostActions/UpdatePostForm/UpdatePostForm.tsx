import { component$, useSignal } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Post } from "~/server/db/types";
import { PostForm } from "../../PostForm/PostForm";

type Props = {
  action: FormProps<void>["action"];
  post: Post;
};

export const UpdatePostForm = component$<Props>((props) => {
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
            isLoading={props.action.isPending}
            action={props.action}
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
