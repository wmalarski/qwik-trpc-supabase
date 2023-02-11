import { component$ } from "@builder.io/qwik";
import type { Comment } from "~/server/db/types";
import { CommentsListItem } from "./CommentsListItem/CommentsListItem";

type Props = {
  comments: Comment[];
  count: number;
};

export const CommentsList = component$<Props>((props) => {
  return (
    <div>
      {props.comments.map((comment) => (
        <CommentsListItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
});
