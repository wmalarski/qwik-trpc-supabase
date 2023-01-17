import { component$, PropFunction } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { protectedTrpcProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";

export const getData = loader$(
  protectedTrpcProcedure.loader(({ trpc, params }) => {
    return trpc.comment.listForParent({
      parentId: params.commentId,
      skip: 0,
      take: 10,
    });
  })
);

type Props = {
  comment: Comment;
  onUpdateSuccess$: PropFunction<(comment: Comment) => void>;
};

export const CommentCard = component$<Props>((props) => {
  const resource = getData.use();

  const backPath = props.comment.parentId
    ? paths.comment(props.comment.parentId)
    : paths.post(props.comment.postId);

  return (
    <div>
      <a class="link" href={backPath}>
        Back
      </a>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <CommentActions comment={props.comment} />
      <CreateCommentForm
        parentId={props.comment.id}
        postId={props.comment.postId}
      />
      <CommentsList
        comments={resource.value.comments}
        count={resource.value.count}
      />
    </div>
  );
});
