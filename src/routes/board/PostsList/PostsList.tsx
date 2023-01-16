import { component$, PropFunction } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { PostListItem } from "./PostListItem/PostListItem";

type Props = {
  posts: Post[];
  onDeleteSuccess$: PropFunction<(postId: string) => void>;
  onUpdateSuccess$: PropFunction<(post: Post) => void>;
};

export const PostsList = component$<Props>((props) => {
  return (
    <div class="flex flex-col gap-4">
      {props.posts.map((post) => (
        <PostListItem
          onDeleteSuccess$={props.onDeleteSuccess$}
          onUpdateSuccess$={props.onUpdateSuccess$}
          post={post}
        />
      ))}
    </div>
  );
});
