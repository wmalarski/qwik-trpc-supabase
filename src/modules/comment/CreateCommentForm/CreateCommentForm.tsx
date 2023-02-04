import { component$ } from "@builder.io/qwik";
import type { Comment } from "~/server/db/types";
import { TrpcActionStore, useTrpcAction } from "~/utils/trpc";
import { CommentForm } from "../CommentForm/CommentForm";

type Props = {
  action: TrpcActionStore<Comment>;
  parentId: string | null;
  postId: string;
};

export const CreateCommentForm = component$<Props>((props) => {
  const action = useTrpcAction(props.action).comment.create();

  return (
    <div>
      <CommentForm
        isLoading={props.action.isRunning}
        onSubmit$={({ content }) => {
          action.execute({
            content,
            parentId: props.parentId,
            postId: props.postId,
          });
        }}
      />

      {props.action.status === 200 ? (
        <span>Success</span>
      ) : typeof props.action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
