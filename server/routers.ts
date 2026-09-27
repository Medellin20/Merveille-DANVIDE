import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import {
  DEFAULT_PORTFOLIO_CONTENT,
  portfolioContentSchema,
} from "../shared/portfolioContent";
import { z } from "zod";
import {
  getSavedPortfolioContent,
  savePortfolioContentToSupabase,
} from "./portfolioContent";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  ADMIN_SESSION_COOKIE,
  clearAdminLoginAttempts,
  isAdminLoginRateLimited,
  recordFailedAdminLogin,
  signAdminSession,
  verifyAdminPassword,
} from "./_core/adminAuth";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ({
      user: ctx.user,
      isAdmin: ctx.isAdminAuthenticated,
    })),
    adminLogin: publicProcedure
      .input(z.object({ password: z.string().min(1).max(256) }))
      .mutation(async ({ ctx, input }) => {
        if (
          !ENV.adminPassword ||
          Buffer.byteLength(ENV.cookieSecret, "utf8") < 32
        ) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "L’authentification admin n’est pas configurée sur le serveur.",
          });
        }

        const ip = ctx.req.ip;
        if (isAdminLoginRateLimited(ip)) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Trop de tentatives. Réessayez dans 15 minutes.",
          });
        }

        if (!verifyAdminPassword(input.password, ENV.adminPassword)) {
          recordFailedAdminLogin(ip);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Mot de passe incorrect.",
          });
        }

        clearAdminLoginAttempts(ip);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(ADMIN_SESSION_COOKIE, await signAdminSession(ENV.cookieSecret), {
          ...cookieOptions,
          maxAge: 8 * 60 * 60 * 1000,
        });
        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  portfolio: router({
    get: publicProcedure.query(() => getSavedPortfolioContent()),
    save: adminProcedure
      .input(portfolioContentSchema)
      .mutation(({ input }) => savePortfolioContentToSupabase(input)),
    reset: adminProcedure.mutation(async () => {
      await savePortfolioContentToSupabase(DEFAULT_PORTFOLIO_CONTENT);
      return DEFAULT_PORTFOLIO_CONTENT;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
