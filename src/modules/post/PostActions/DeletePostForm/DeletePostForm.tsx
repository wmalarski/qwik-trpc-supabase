import { component$, PropFunction, useStore } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { useTrpcContext } from "~/routes/context";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  onSuccess$: PropFunction<(postId: string) => void>;
  post: Post;
};

export const DeletePostForm = component$<Props>((props) => {
  const onSuccess$ = props.onSuccess$;
  const postId = props.post.id;

  const state = useStore<State>({ status: "idle" });
  const trpcContext = useTrpcContext();

  return (
    <>
      <button
        class={{
          "btn btn-ghost btn-sm": true,
          loading: state.status === "loading",
        }}
        onClick$={async () => {
          try {
            state.status = "loading";
            const trpc = await trpcContext();
            await trpc?.post.delete.mutate({ id: postId });
            onSuccess$(postId);
            state.status = "success";
          } catch (error) {
            state.status = "error";
          }
        }}
      >
        Remove
      </button>

      {state.status === "success" ? (
        <span>Success</span>
      ) : state.status === "error" ? (
        <span>Error</span>
      ) : null}
    </>
  );
});
