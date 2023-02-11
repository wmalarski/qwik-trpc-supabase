import { component$ } from "@builder.io/qwik";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import type { Post } from "~/server/db/types";
import { paths } from "~/utils/paths";

type Props = {
  post: Post;
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
          <PostActions post={props.post} />
        </div>
      </div>
    </div>
  );
});
