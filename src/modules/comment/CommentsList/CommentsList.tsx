import { component$ } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { paths } from "~/utils/paths";
import { CommentActions } from "../CommentActions/CommentActions";

type CommentsListItemProps = {
  comment: Comment;
};

export const CommentsListItem = component$<CommentsListItemProps>((props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <a class="link" href={paths.comment(props.comment.id)}>
        Show comments
      </a>
      <CommentActions comment={props.comment} />
    </div>
  );
});

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
