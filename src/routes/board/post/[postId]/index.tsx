import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { withProtected } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { PostCard } from "./PostCard/PostCard";

export const getData = loader$(
  endpointBuilder()
    .use(withProtected())
    .use(withTrpc())
    .loader(async ({ trpc, params }) => {
      const postId = params.postId;
      const [post, comments] = await Promise.all([
        trpc.post.get({ id: postId }),
        trpc.comment.listForPost({ postId, skip: 0, take: 10 }),
      ]);

      return { comments, post };
    })
);

export default component$(() => {
  const resource = getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Post</h1>
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => (
          <PostCard
            comments={result.comments?.comments || []}
            commentsCount={result.comments?.count || 0}
            post={result.post}
          />
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
