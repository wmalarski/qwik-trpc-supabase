import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { InferPromise } from "~/utils/trpc";

export const onGet = async (ev: RequestEvent) => {
  const { serverCaller } = await import("~/server/trpc/router");

  const { caller, context } = await serverCaller(ev);

  if (!context.user) {
    throw ev.response.redirect(paths.signIn);
  }

  const postId = ev.params.postId;
  const [post, comments] = await Promise.all([
    caller.post.get({ id: postId }),
    caller.comment.list({ parentId: null, postId, skip: 0, take: 10 }),
  ]);

  return { comments, post };
};

export default component$(() => {
  const resource = useEndpoint<InferPromise<typeof onGet>>();

  return (
    <div class="flex flex-col gap-2">
      <h1>Post</h1>
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => <pre>{JSON.stringify(result, null, 2)}</pre>}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
