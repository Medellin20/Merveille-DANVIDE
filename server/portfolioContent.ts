import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import {
  DEFAULT_PORTFOLIO_CONTENT,
  portfolioContentSchema,
  type PortfolioContent,
} from "../shared/portfolioContent";
import { ENV } from "./_core/env";

let supabaseClient: SupabaseClient | undefined;

function getSupabaseClient() {
  if (!ENV.supabaseUrl || !ENV.supabaseServiceRoleKey) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message:
        "Supabase n’est pas configuré. Définissez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY côté serveur.",
    });
  }

  supabaseClient ??= createClient(ENV.supabaseUrl, ENV.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return supabaseClient;
}

export async function getSavedPortfolioContent(): Promise<PortfolioContent> {
  const { data, error } = await getSupabaseClient()
    .from("portfolio_content")
    .select("content")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Impossible de lire le contenu dans Supabase : ${error.message}`,
    });
  }

  if (!data) return DEFAULT_PORTFOLIO_CONTENT;

  const parsedContent = portfolioContentSchema.safeParse(data.content);
  if (!parsedContent.success) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Le contenu enregistré dans Supabase n’a pas le format attendu.",
    });
  }

  return parsedContent.data;
}

export async function savePortfolioContentToSupabase(
  content: PortfolioContent,
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("portfolio_content")
    .upsert(
      { id: "default", content, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );

  if (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Impossible d’enregistrer le contenu dans Supabase : ${error.message}`,
    });
  }
}
