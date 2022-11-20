import { component$ } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { paths } from "~/utils/paths";

type Props = {
  comment: Comment;
};

export const CommentsListItem = component$((props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <a class="link" href={paths.comment(props.comment.id)}>
        Show comments
      </a>
      <CommentActions
        comment={props.comment}
        onDeleteSuccess$={() => {
          window.location.replace(location.pathname);
        }}
        onUpdateSuccess$={() => {
          window.location.replace(location.pathname);
        }}
      />
    </div>
  );
});
