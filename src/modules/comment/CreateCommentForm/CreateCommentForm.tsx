import { component$ } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Comment } from "~/server/db/types";
import { useTrpcAction } from "~/utils/trpc";
import { CommentForm } from "../CommentForm/CommentForm";

type Props = {
  action: FormProps<Comment>["action"];
  parentId: string | null;
  postId: string;
};

export const CreateCommentForm = component$<Props>((props) => {
  const action = useTrpcAction(props.action).comment.create();

  return (
    <div>
      <CommentForm
        isLoading={props.action.isPending}
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
