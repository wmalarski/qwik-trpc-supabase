import { component$ } from "@builder.io/qwik";
import type { Post } from "~/server/db/types";
import { PostListItem } from "./PostListItem/PostListItem";

type Props = {
  posts: Post[];
};

export const PostsList = component$<Props>((props) => {
  return (
    <div class="flex flex-col gap-4">
      {props.posts.map((post) => (
        <PostListItem post={post} />
      ))}
    </div>
  );
});
