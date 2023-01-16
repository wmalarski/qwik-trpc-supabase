import { component$, PropFunction } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { paths } from "~/utils/paths";

type Props = {
  comment: Comment;
  onDeleteSuccess$: PropFunction<(commentId: string) => void>;
  onUpdateSuccess$: PropFunction<(comment: Comment) => void>;
};

export const CommentsListItem = component$<Props>((props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <a class="link" href={paths.comment(props.comment.id)}>
        Show comments
      </a>
      <CommentActions
        comment={props.comment}
        onDeleteSuccess$={props.onDeleteSuccess$}
        onUpdateSuccess$={props.onUpdateSuccess$}
      />
    </div>
  );
});
