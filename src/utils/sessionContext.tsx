import {
  component$,
  createContext,
  Slot,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import type { User } from "@supabase/supabase-js";

type SessionContextValue = {
  user: User | null;
};

export const SessionContext = createContext<SessionContextValue>(
  "src.utils.sessionContext"
);

export const useSessionContextProvider = (value: SessionContextValue) => {
  return useContextProvider(SessionContext, value);
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};

type Props = {
  value: User;
};

export const SessionContextProvider = component$((props: Props) => {
  useContextProvider(SessionContext, { user: props.value });

  return <Slot />;
});
