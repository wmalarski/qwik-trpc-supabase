import { component$ } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";

type Props = {
  comment: Comment;
};

export const CommentsListItem = component$((props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
    </div>
  );
});
