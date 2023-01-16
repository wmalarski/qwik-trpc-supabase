import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { withProtected } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { CommentCard } from "./CommentCard/CommentCard";

export const getData = loader$(
  endpointBuilder()
    .use(withProtected())
    .use(withTrpc())
    .loader(async ({ trpc, params }) => {
      const commentId = params.commentId;
      const [comment, comments] = await Promise.all([
        trpc.comment.get({ id: commentId }),
        trpc.comment.listForParent({ parentId: commentId, skip: 0, take: 10 }),
      ]);

      return { comment, comments };
    })
);

export default component$(() => {
  const resource = getData.use();

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
            onCreateSuccess$={(created) => {
              resource.value.comments.comments.splice(0, 0, created);
              resource.value.comments.count += 1;
            }}
            onUpdateSuccess$={(updated) => {
              resource.value.comment = updated;
            }}
          />
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
