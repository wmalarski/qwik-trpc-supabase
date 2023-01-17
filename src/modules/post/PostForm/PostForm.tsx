import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";

type FormResult = {
  id: string;
  content: string;
};

type Props = {
  action: FormProps<void>["action"];
  initialValue?: FormResult;
  isLoading: boolean;
};

export const PostForm = component$<Props>((props) => {
  return (
    <Form class="flex flex-col gap-2" action={props.action}>
      <h2 class="text-xl">Add post</h2>

      {props.initialValue?.id ? (
        <input type="hidden" name="id" value={props.initialValue.id} />
      ) : null}

      <div class="form-control w-full">
        <label for="content" class="label">
          <span class="label-text">Text</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="content"
          id="content"
          placeholder="Type here"
          type="text"
          value={props.initialValue?.content}
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
