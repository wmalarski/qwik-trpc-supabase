import { component$ } from "@builder.io/qwik";
import type { Comment } from "~/server/db/types";
import { TrpcActionStore } from "~/utils/trpc";
import { CommentsListItem } from "./CommentsListItem/CommentsListItem";

type Props = {
  comments: Comment[];
  count: number;
  deleteCommentAction: TrpcActionStore;
  updateCommentAction: TrpcActionStore<Comment>;
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
