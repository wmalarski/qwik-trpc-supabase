import { component$, PropFunction } from "@builder.io/qwik";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import type { Post } from "~/server/db/types";
import { paths } from "~/utils/paths";
import {
  createComment,
  deleteComment,
  deletePost,
  getComments,
  updateComment,
  updatePost,
} from "..";

type Props = {
  onUpdateSuccess$: PropFunction<(post: Post) => void>;
  post: Post;
};

export const PostCard = component$<Props>((props) => {
  const resource = getComments.use();

  const deletePostAction = deletePost.use();
  const updatePostAction = updatePost.use();

  const deleteCommentAction = deleteComment.use();
  const updateCommentAction = updateComment.use();
  const createCommentAction = createComment.use();

  return (
    <div>
      <a class="link" href={paths.board}>
        Back
      </a>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <PostActions
        updatePostAction={updatePostAction}
        deletePostAction={deletePostAction}
        post={props.post}
      />
      <CreateCommentForm
        action={createCommentAction}
        parentId={null}
        postId={props.post.id}
      />
      <CommentsList
        comments={resource.value.comments}
        count={resource.value.count}
        deleteCommentAction={deleteCommentAction}
        updateCommentAction={updateCommentAction}
      />
    </div>
  );
});
