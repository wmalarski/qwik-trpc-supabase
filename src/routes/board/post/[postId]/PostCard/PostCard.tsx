import { component$, PropFunction } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { protectedTrpcProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";

export const getData = loader$(
  protectedTrpcProcedure.loader(({ trpc, params }) => {
    return trpc.comment.listForPost({
      postId: params.postId,
      skip: 0,
      take: 10,
    });
  })
);

type Props = {
  onUpdateSuccess$: PropFunction<(post: Post) => void>;
  post: Post;
};

export const PostCard = component$<Props>((props) => {
  const resource = getData.use();

  return (
    <div>
      <a class="link" href={paths.board}>
        Back
      </a>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <PostActions post={props.post} />
      <CreateCommentForm parentId={null} postId={props.post.id} />
      <CommentsList
        comments={resource.value.comments}
        count={resource.value.count}
      />
    </div>
  );
});
