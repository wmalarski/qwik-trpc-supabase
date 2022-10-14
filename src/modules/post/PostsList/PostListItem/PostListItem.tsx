import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { paths } from "~/utils/paths";
import { PostActions } from "../../PostActions/PostActions";

type Props = {
  post: Post;
};

export const PostListItem = component$((props: Props) => {
  const location = useLocation();

  return (
    <div class="card card-bordered card-compact">
      <div class="card-body">
        <pre>{JSON.stringify(props.post, null, 2)}</pre>
        <div class="card-actions">
          <Link class="link" href={paths.post(props.post.id)}>
            Show comments
          </Link>
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