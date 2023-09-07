import { component$ } from "@builder.io/qwik";
import { Form, useNavigate } from "@builder.io/qwik-city";
import { useSupabaseSignInWithOAuth } from "../../../plugin@supabase";

export const GoogleForm = component$(() => {
  const action = useSupabaseSignInWithOAuth();
  const navigate = useNavigate();

  return (
    <Form
      class="flex flex-col gap-2"
      action={action}
      onSubmitCompleted$={() => {
        const url = action.value?.url;
        if (url) {
          navigate(url);
        }
      }}
    >
      <h2 class="text-xl">Login with google</h2>
      <input
        type="text"
        id="provider"
        readOnly
        name="provider"
        value="google"
      />
      <span class="label text-red-500">{JSON.stringify(action.value)}</span>{" "}
      <button class="btn btn-primary" type="submit">
        Google
      </button>
    </Form>
  );
});
