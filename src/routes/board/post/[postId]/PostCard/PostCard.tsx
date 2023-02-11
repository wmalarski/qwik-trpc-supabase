import { component$, PropFunction } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { paths } from "~/utils/paths";
import { getComments } from "..";

type Props = {
  onUpdateSuccess$: PropFunction<(post: Post) => void>;
  post: Post;
};

export const PostCard = component$<Props>((props) => {
  const resource = getComments.use();

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
