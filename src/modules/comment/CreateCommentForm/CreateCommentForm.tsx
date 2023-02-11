import { component$ } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import { trpcAction } from "~/server/trpc/action";
import { useTrpcAction } from "~/utils/trpc";
import { CommentForm } from "../CommentForm/CommentForm";

export const api = action$((data, event) => trpcAction(data, event));

type Props = {
  parentId: string | null;
  postId: string;
};

export const CreateCommentForm = component$<Props>((props) => {
  const action = useTrpcAction(api).comment.create();

  return (
    <div>
      <CommentForm
        isLoading={action.isRunning}
        onSubmit$={({ content }) => {
          action.run({
            content,
            parentId: props.parentId,
            postId: props.postId,
          });
        }}
      />

      {action.status === 200 ? (
        <span>Success</span>
      ) : typeof action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
