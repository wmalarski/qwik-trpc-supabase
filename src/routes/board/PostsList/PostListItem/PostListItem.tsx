import { component$ } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { paths } from "~/utils/paths";
import { deletePost, updatePost } from "../..";

type Props = {
  post: Post;
};

export const PostListItem = component$<Props>((props) => {
  const deletePostAction = deletePost.use();
  const updatePostAction = updatePost.use();

  return (
    <div class="card card-bordered card-compact overflow-visible">
      <div class="card-body">
        <pre>{JSON.stringify(props.post, null, 2)}</pre>
        <div class="card-actions">
          <a class="btn btn-link btn-sm" href={paths.post(props.post.id)}>
            Show comments
          </a>
          <PostActions
            updatePostAction={updatePostAction}
            deletePostAction={deletePostAction}
            post={props.post}
          />
        </div>
      </div>
    </div>
  );
});
