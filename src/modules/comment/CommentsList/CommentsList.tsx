import { component$, PropFunction } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { CommentsListItem } from "./CommentsListItem/CommentsListItem";

type Props = {
  comments: Comment[];
  count: number;
  onDeleteSuccess$: PropFunction<(commentId: string) => void>;
  onUpdateSuccess$: PropFunction<(comment: Comment) => void>;
};

export const CommentsList = component$<Props>((props) => {
  return (
    <div>
      {props.comments.map((comment) => (
        <CommentsListItem
          onDeleteSuccess$={props.onDeleteSuccess$}
          onUpdateSuccess$={props.onUpdateSuccess$}
          comment={comment}
        />
      ))}
    </div>
  );
});
