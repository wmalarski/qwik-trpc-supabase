import { component$ } from "@builder.io/qwik";
import { PostForm } from "~/modules/post/PostForm/PostForm";
import { useCreatePostAction } from "..";

export const CreatePostForm = component$(() => {
  const action = useCreatePostAction();

  return (
    <div>
      <PostForm
        isLoading={action.isRunning}
        onSubmit$={({ content }) => {
          action.submit({ content });
        }}
      />
      {action.value?.status === "success" ? (
        <span>Success</span>
      ) : action.value?.status === "error" ? (
        <pre>{JSON.stringify(action.value, null, 2)}</pre>
      ) : null}
    </div>
  );
});
