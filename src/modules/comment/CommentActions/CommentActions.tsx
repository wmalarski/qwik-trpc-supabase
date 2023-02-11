import { component$ } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { DeleteCommentForm } from "./DeleteCommentForm/DeleteCommentForm";
import { UpdateCommentForm } from "./UpdateCommentForm/UpdateCommentForm";

type Props = {
  comment: Comment;
};

export const CommentActions = component$<Props>((props) => {
  return (
    <>
      <DeleteCommentForm comment={props.comment} />
      <UpdateCommentForm comment={props.comment} />
    </>
  );
});
