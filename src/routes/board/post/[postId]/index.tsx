import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { withProtected } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { PostCard } from "./PostCard/PostCard";

export const onGet = endpointBuilder()
  .use(withProtected())
  .use(withTrpc())
  .resolver(async ({ trpc, params }) => {
    const postId = params.postId;
    const [post, comments] = await Promise.all([
      trpc.post.get({ id: postId }),
      trpc.comment.listForPost({ postId, skip: 0, take: 10 }),
    ]);

    return { comments, post };
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

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
