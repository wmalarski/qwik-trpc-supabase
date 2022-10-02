import { component$ } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { CommentsList } from "../CommentsList/CommentsList";

type Props = {
  comments: Comment[];
  commentsCount: number;
  comment: Comment;
};

export const CommentCard = component$((props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.comment)}</pre>
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
