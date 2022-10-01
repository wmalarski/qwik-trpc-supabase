import { createContext } from "@builder.io/qwik";
import type { Session } from "@supabase/supabase-js";

type SessionContextValue = {
  session: Session | null;
};

export const SessionContext = createContext<SessionContextValue>(
  "src.utils.sessionContext"
);

export const useSessionContextProvider = () => {
  //
};
