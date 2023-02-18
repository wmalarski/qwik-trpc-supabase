import { component$ } from "@builder.io/qwik";
import { PostForm } from "~/modules/post/PostForm/PostForm";
import { trpc } from "~/server/trpc/serverApi";

export const useCreatePostAction = trpc.post.create.action$();

export const CreatePostForm = component$(() => {
  const action = useCreatePostAction();

  return (
    <div>
      <PostForm
        isLoading={action.isRunning}
        onSubmit$={({ content }) => {
          action.run({ content });
        }}
      />
      <pre>{JSON.stringify(action.value, null, 2)}</pre>
      {action.status === 200 ? (
        <span>Success</span>
      ) : typeof action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
