import { component$, PropFunction } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { DeleteCommentForm } from "./DeleteCommentForm/DeleteCommentForm";
import { UpdateCommentForm } from "./UpdateCommentForm/UpdateCommentForm";

type Props = {
  comment: Comment;
  onDeleteSuccess$?: PropFunction<() => void>;
};

export const CommentActions = component$((props: Props) => {
  return (
    <>
      <DeleteCommentForm
        comment={props.comment}
        onDeleteSuccess$={props.onDeleteSuccess$}
      />
      <UpdateCommentForm comment={props.comment} />
    </>
  );
});
