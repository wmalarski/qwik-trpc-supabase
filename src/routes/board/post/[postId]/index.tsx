import { component$, Resource } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { protectedTrpcProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";
import { PostCard } from "./PostCard/PostCard";

export const getData = loader$(
  protectedTrpcProcedure.loader(({ trpc, params }) => {
    return trpc.post.get({ id: params.postId });
  })
);

export const getComments = loader$(
  protectedTrpcProcedure.loader(({ trpc, params }) => {
    return trpc.comment.listForPost({
      postId: params.postId,
      skip: 0,
      take: 10,
    });
  })
);

export const deleteComment = action$(
  protectedTrpcProcedure.action(async (form, { trpc }) => {
    const id = form.get("id") as string;
    await trpc.comment.delete({ id });
  })
);

export const updateComment = action$(
  protectedTrpcProcedure.action(async (form, { trpc }) => {
    const id = form.get("id") as string;
    const text = form.get("text") as string;

    await trpc.comment.update({ id, text });
  })
);

export const createComment = action$(
  protectedTrpcProcedure.action(async (form, { trpc, redirect }) => {
    const text = form.get("text") as string;
    const parentId = form.get("parentId") as string;
    const postId = form.get("postId") as string;

    const comment = await trpc.comment.create({
      parentId,
      postId,
      text,
    });

    throw redirect(302, paths.comment(comment.id));
  })
);

export const updatePost = action$(
  protectedTrpcProcedure.action(async (form, { trpc }) => {
    const id = form.get("id") as string;
    const content = form.get("content") as string;

    await trpc.post.update({ content, id });
  })
);

export const deletePost = action$(
  protectedTrpcProcedure.action(async (form, { trpc, redirect }) => {
    const id = form.get("id") as string;

    await trpc.post.delete({ id });

    redirect(302, paths.board);
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
