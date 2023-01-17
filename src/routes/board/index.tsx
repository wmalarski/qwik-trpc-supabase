import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { protectedTrpcProcedure } from "~/server/procedures";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";
import { PostsList } from "./PostsList/PostsList";

export const getData = loader$(
  protectedTrpcProcedure.loader(({ trpc }) => {
    return trpc.post.list({ skip: 0, take: 10 });
  })
);

export default component$(() => {
  const resource = getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm
        onSuccess$={(post) => {
          resource.value.posts.splice(0, 0, post);
          resource.value.count += 1;
        }}
      />
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => (
          <PostsList
            onDeleteSuccess$={(postId) => {
              const posts = resource.value.posts;
              const index = posts.findIndex((entry) => entry.id === postId);
              resource.value.posts.splice(index, 1);
              resource.value.count -= 1;
            }}
            onUpdateSuccess$={(post) => {
              const posts = resource.value.posts;
              const index = posts.findIndex((entry) => entry.id === post.id);
              resource.value.posts.splice(index, 1, post);
            }}
            posts={result.posts}
          />
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
