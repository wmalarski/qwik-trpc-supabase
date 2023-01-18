import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";
import type { Comment } from "~/server/db/types";

type FormResult = {
  text: string;
  id: string;
  parentId: string | null;
  postId: string;
};

type Props = {
  action: FormProps<Comment>["action"];
  initialValue?: Partial<FormResult>;
  isLoading: boolean;
};

export const CommentForm = component$<Props>((props) => {
  return (
    <Form class="flex flex-col gap-2" action={props.action}>
      <h2 class="text-xl">Add comment</h2>

      {props.initialValue?.id ? (
        <input type="hidden" name="id" value={props.initialValue.id} />
      ) : null}

      {props.initialValue?.parentId ? (
        <input
          type="hidden"
          name="parentId"
          value={props.initialValue.parentId}
        />
      ) : null}

      {props.initialValue?.postId ? (
        <input type="hidden" name="postId" value={props.initialValue.postId} />
      ) : null}

      <div class="form-control w-full">
        <label for="text" class="label">
          <span class="label-text">Text</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="text"
          placeholder="Type here"
          type="text"
          value={props.initialValue?.text}
        />
      </div>

      <button
        class={{
          "btn btn-primary mt-2": true,
          loading: props.isLoading,
        }}
        type="submit"
      >
        Save
      </button>
    </Form>
  );
});
