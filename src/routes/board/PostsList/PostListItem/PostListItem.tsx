import { component$, PropFunction } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { paths } from "~/utils/paths";

type Props = {
  post: Post;
  onDeleteSuccess$: PropFunction<(postId: string) => void>;
  onUpdateSuccess$: PropFunction<(post: Post) => void>;
};

export const PostListItem = component$<Props>((props) => {
  return (
    <div class="card card-bordered card-compact overflow-visible">
      <div class="card-body">
        <pre>{JSON.stringify(props.post, null, 2)}</pre>
        <div class="card-actions">
          <a class="btn btn-link btn-sm" href={paths.post(props.post.id)}>
            Show comments
          </a>
          <PostActions
            post={props.post}
            onUpdateSuccess$={props.onUpdateSuccess$}
            onDeleteSuccess$={props.onDeleteSuccess$}
          />
        </div>
      </div>
    </div>
  );
});
