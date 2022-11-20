import {
  $,
  createContext,
  NoSerialize,
  noSerialize,
  QRL,
  useContext,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";
import { createTrpc } from "~/utils/trpc";

type ClientTrpc = NoSerialize<ReturnType<typeof createTrpc>>;

export const TrpcContext = createContext<QRL<() => ClientTrpc>>("trpc-context");

export const useTrpcContextProvider = () => {
  const trpc = useSignal<ClientTrpc>();

  const getter = $(() => {
    if (trpc.value) {
      return trpc.value;
    }
    trpc.value = noSerialize(createTrpc());

    return trpc.value;
  });

  useContextProvider(TrpcContext, getter);
};

export const useTrpcContext = () => {
  return useContext(TrpcContext);
};
