import { action$ } from "@builder.io/qwik-city";

type ActionParameter = Parameters<typeof action$>[0];
export type RequestEventLoader = Parameters<ActionParameter>[1];

export type ServerAction<T = unknown> = ReturnType<typeof action$<T>>;
export type ServerActionUtils<T> = ReturnType<ServerAction<T>["use"]>;
