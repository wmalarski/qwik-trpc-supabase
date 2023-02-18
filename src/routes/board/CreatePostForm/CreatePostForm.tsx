import { component$ } from "@builder.io/qwik";
import { PostForm } from "~/modules/post/PostForm/PostForm";
import { trpc } from "~/server/trpc/api";

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

      {action.value?.status === "success" ? (
        <span>Success</span>
      ) : action.value?.status === "error" ? (
        <pre>{JSON.stringify(action.value, null, 2)}</pre>
      ) : null}
    </div>
  );
});
