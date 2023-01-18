import { component$ } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Comment } from "~/server/db/types";
import { CommentsListItem } from "./CommentsListItem/CommentsListItem";

type Props = {
  comments: Comment[];
  count: number;
  deleteCommentAction: FormProps<void>["action"];
  updateCommentAction: FormProps<Comment>["action"];
};

export const CommentsList = component$<Props>((props) => {
  return (
    <div>
      {props.comments.map((comment) => (
        <CommentsListItem
          key={comment.id}
          comment={comment}
          deleteCommentAction={props.deleteCommentAction}
          updateCommentAction={props.updateCommentAction}
        />
      ))}
    </div>
  );
});
