import type { RequestEvent, RequestEventLoader } from "@builder.io/qwik-city";
import type { RequestEventAction } from "@builder.io/qwik-city/middleware/request-handler";

export type ServerEvent =
  | RequestEventLoader
  | RequestEvent
  | RequestEventAction;
