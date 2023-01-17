import { component$ } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import { PostForm } from "~/modules/post/PostForm/PostForm";

type Props = {
  action: FormProps<void>["action"];
};

export const CreatePostForm = component$((props: Props) => {
  return (
    <div>
      <PostForm isLoading={props.action.isPending} action={props.action} />
      {props.action.status === 200 ? (
        <span>Success</span>
      ) : typeof props.action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
