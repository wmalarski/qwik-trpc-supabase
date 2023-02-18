import { component$ } from "@builder.io/qwik";
import { action$ } from "@builder.io/qwik-city";
import { PostForm } from "~/modules/post/PostForm/PostForm";
import { trpcAction } from "~/server/trpc/action";
import { trpc } from "~/server/trpc/serverApi";
import { useTrpcAction } from "~/utils/trpc";

export const api = action$((data, event) => trpcAction(data, event));

export const api2 = trpc.post.create.action$();

export const CreatePostForm = component$(() => {
  const [action] = useTrpcAction(api).post.create();

  const api22 = api2();

  return (
    <div>
      <PostForm
        isLoading={action.isRunning}
        onSubmit$={({ content }) => {
          api22.run({ content });
        }}
      />
      <pre>{JSON.stringify(api22.value, null, 2)}</pre>
      <pre>{JSON.stringify(action.value, null, 2)}</pre>
      {action.status === 200 ? (
        <span>Success</span>
      ) : typeof action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
