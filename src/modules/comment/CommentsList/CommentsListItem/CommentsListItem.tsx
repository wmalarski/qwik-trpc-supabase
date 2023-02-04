import { component$ } from "@builder.io/qwik";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import type { Comment } from "~/server/db/types";
import { paths } from "~/utils/paths";
import { TrpcActionStore } from "~/utils/trpc";

type Props = {
  comment: Comment;
  deleteCommentAction: TrpcActionStore;
  updateCommentAction: TrpcActionStore<Comment>;
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
        deleteCommentAction={props.deleteCommentAction}
        updateCommentAction={props.updateCommentAction}
      />
    </div>
  );
});
