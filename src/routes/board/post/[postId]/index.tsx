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
    .loader(({ trpc, params }) => {
      return trpc.post.get({ id: params.postId });
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
            post={result}
            onUpdateSuccess$={(post) => {
              resource.value = post;
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
