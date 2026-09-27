import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { adminProcedure, router } from "./_core/trpc";

function createContext(
  user: TrpcContext["user"],
  isAdminAuthenticated = false,
): TrpcContext {
  return {
    user,
    isAdminAuthenticated,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("portfolio admin access", () => {
  it("does not grant access based on an OAuth user's database role", async () => {
    const roleAdmin = {
      id: 1,
      openId: "portfolio-admin",
      name: "Merveille Danvide",
      email: "bonjour@merveille-danvide.fr",
      loginMethod: "legacy",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const result = await appRouter.createCaller(createContext(roleAdmin)).auth.me();

    expect(result.isAdmin).toBe(false);
    expect(result.user?.role).toBe("admin");
  });

  it("grants admin procedures to a password session without an admin role", async () => {
    const passwordSession = {
      id: 0,
      openId: "password-admin",
      name: "Administratrice",
      email: null,
      loginMethod: "password",
      role: "user" as const,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      lastSignedIn: new Date(0),
    };
    const testRouter = router({
      adminCheck: adminProcedure.query(() => "allowed"),
    });

    await expect(
      testRouter.createCaller(createContext(passwordSession, true)).adminCheck(),
    ).resolves.toBe("allowed");
  });

  it("keeps the public session query empty for visitors", async () => {
    const result = await appRouter.createCaller(createContext(null)).auth.me();
    expect(result).toEqual({ user: null, isAdmin: false });
  });

  it("prevents non-admin sessions from resetting saved portfolio content", async () => {
    await expect(
      appRouter.createCaller(createContext({
        id: 1,
        openId: "role-admin-only",
        name: "Role Admin",
        email: null,
        loginMethod: "oauth",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      })).portfolio.reset(),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
