import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { paths } from "~/utils/paths";

type Props = {
  post: Post;
};

export const PostListItem = component$((props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <Link class="link" href={paths.post(props.post.id)}>
        Show comments
      </Link>
    </div>
  );
});
