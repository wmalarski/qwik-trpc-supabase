import { component$, PropFunction } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { DeleteCommentForm } from "./DeleteCommentForm/DeleteCommentForm";
import { UpdateCommentForm } from "./UpdateCommentForm/UpdateCommentForm";

type Props = {
  comment: Comment;
  onDeleteSuccess$?: PropFunction<() => void>;
  onUpdateSuccess$?: PropFunction<() => void>;
};

export const CommentActions = component$<Props>((props) => {
  return (
    <>
      <DeleteCommentForm
        comment={props.comment}
        onSuccess$={props.onDeleteSuccess$}
      />
      <UpdateCommentForm
        comment={props.comment}
        onSuccess$={props.onUpdateSuccess$}
      />
    </>
  );
});
