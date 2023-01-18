import { action$ } from "@builder.io/qwik-city";

type ServerAction<T> = ReturnType<typeof action$<T>>;
type ServerActionUtils<T> = ReturnType<ServerAction<T>["use"]>;

export type ActionUtils<T> = T extends ServerAction<infer A>
  ? ServerActionUtils<A>
  : never;
