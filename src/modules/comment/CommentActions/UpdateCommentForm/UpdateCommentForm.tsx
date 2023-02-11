import { component$, useSignal } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { trpcAction } from "~/server/trpc/action";
import { useTrpcAction } from "~/utils/trpc";
import { CommentForm } from "../../CommentForm/CommentForm";

export const api = action$((data, event) => trpcAction(data, event));

type Props = {
  comment: Comment;
};

export const UpdateCommentForm = component$<Props>((props) => {
  const isOpen = useSignal(false);

  const [action, run] = useTrpcAction(api).comment.update();

  return (
    <>
      <button
        class="btn"
        onClick$={() => {
          isOpen.value = !isOpen.value;
        }}
      >
        Edit
      </button>

      {isOpen.value && (
        <>
          <CommentForm
            initialValue={props.comment}
            isLoading={action.isRunning}
            onSubmit$={async ({ content }) => {
              await run({ content, id: props.comment.id });
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
