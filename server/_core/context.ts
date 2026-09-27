import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { isValidAdminSession } from "./adminAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  isAdminAuthenticated: boolean;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  const isAdminAuthenticated = await isValidAdminSession(opts.req);

  if (isAdminAuthenticated) {
    user = {
      id: 0,
      openId: "password-admin",
      name: "Administratrice",
      email: null,
      loginMethod: "password",
      role: "user",
      createdAt: new Date(0),
      updatedAt: new Date(0),
      lastSignedIn: new Date(0),
    };
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    isAdminAuthenticated,
  };
}
