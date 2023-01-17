import { endpointBuilder } from "~/utils/endpointBuilder";
import { withProtected, withUser } from "./auth/withUser";
import { withTrpc } from "./trpc/withTrpc";

export const protectedTrpcProcedure = endpointBuilder()
  .use(withProtected())
  .use(withTrpc());

export const userProcedure = endpointBuilder().use(withUser());

export const userTrpcProcedure = userProcedure.use(withTrpc());
