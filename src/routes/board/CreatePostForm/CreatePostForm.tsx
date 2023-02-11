import { component$ } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import { PostForm } from "~/modules/post/PostForm/PostForm";
import { trpcAction } from "~/server/trpc/action";
import { useTrpcAction } from "~/utils/trpc";

export const api = action$((data, event) => trpcAction(data, event));

export const CreatePostForm = component$(() => {
  const action = useTrpcAction(api).post.create();

  return (
    <div>
      <PostForm
        isLoading={action.isRunning}
        onSubmit$={({ content }) => {
          action.run({ content });
        }}
      />
      {action.status === 200 ? (
        <span>Success</span>
      ) : typeof action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
