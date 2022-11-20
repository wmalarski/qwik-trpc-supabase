import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { withProtected } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { CommentCard } from "./CommentCard/CommentCard";

export const onGet = endpointBuilder()
  .use(withProtected())
  .use(withTrpc())
  .resolver(async ({ trpc, params }) => {
    const commentId = params.commentId;
    const [comment, comments] = await Promise.all([
      trpc.comment.get({ id: commentId }),
      trpc.comment.listForParent({ parentId: commentId, skip: 0, take: 10 }),
    ]);

    return { comment, comments };
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  return (
    <div class="flex flex-col gap-2">
      <h1>Comment</h1>
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => (
          <CommentCard
            comment={result.comment}
            comments={result.comments?.comments || []}
            commentsCount={result.comments?.count || 0}
          />
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
