import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";
import { CommentCard } from "~/modules/comment/CommentCard/CommentCard";
import { paths } from "~/utils/paths";
import { InferPromise } from "~/utils/trpc";

export const onGet = async (ev: RequestEvent) => {
  const { serverCaller } = await import("~/server/trpc/router");

  const { caller, context } = await serverCaller(ev);

  if (!context.user) {
    throw ev.response.redirect(paths.signIn);
  }

  const commentId = ev.params.commentId;
  const [comment, comments] = await Promise.all([
    caller.comment.get({ id: commentId }),
    caller.comment.listForParent({ parentId: commentId, skip: 0, take: 10 }),
  ]);

  return { comment, comments };
};

export default component$(() => {
  const resource = useEndpoint<InferPromise<typeof onGet>>();

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
