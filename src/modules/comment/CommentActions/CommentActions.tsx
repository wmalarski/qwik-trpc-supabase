import { component$ } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Comment } from "~/server/db/types";
import { DeleteCommentForm } from "./DeleteCommentForm/DeleteCommentForm";
import { UpdateCommentForm } from "./UpdateCommentForm/UpdateCommentForm";

type Props = {
  comment: Comment;
  deleteCommentAction: FormProps<unknown>["action"];
  updateCommentAction: FormProps<Comment>["action"];
};

export const CommentActions = component$<Props>((props) => {
  return (
    <>
      <DeleteCommentForm
        comment={props.comment}
        action={props.deleteCommentAction}
      />
      <UpdateCommentForm
        comment={props.comment}
        action={props.updateCommentAction}
      />
    </>
  );
});
