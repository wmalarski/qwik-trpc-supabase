import { component$ } from "@builder.io/qwik";
import { Post } from "@prisma/client";

export type Props = {
  post: Post;
};

export const PostListItem = component$((props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
    </div>
  );
});
