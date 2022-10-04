import { component$ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { paths } from "~/utils/paths";
import { PostActions } from "../../PostActions/PostActions";

type Props = {
  post: Post;
};

export const PostListItem = component$((props: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <Link class="link" href={paths.post(props.post.id)}>
        Show comments
      </Link>
      <PostActions
        post={props.post}
        onUpdateSuccess$={() => {
          navigate.path = location.pathname;
        }}
      />
    </div>
  );
});
