import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { paths } from "~/utils/paths";
import { PostActions } from "../../../../modules/post/PostActions/PostActions";

type Props = {
  post: Post;
};

export const PostListItem = component$<Props>((props) => {
  const location = useLocation();

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
            onUpdateSuccess$={() => {
              window.location.replace(location.pathname);
            }}
          />
        </div>
      </div>
    </div>
  );
});
