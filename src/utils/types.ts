/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestEvent } from "@builder.io/qwik-city";

export interface ServerFunction {
  (this: RequestEvent, ...args: any[]): any;
}

export interface TypedServerFunction<Input, Output> {
  (this: RequestEvent, args: Input): Output;
}
