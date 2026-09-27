import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DEFAULT_PORTFOLIO_CONTENT, portfolioContentSchema } from "@shared/portfolioContent";
import type { PortfolioContent } from "@shared/portfolioContent";
import { trpc } from "@/lib/trpc";

export { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolioContent";
export type { PortfolioContent } from "@shared/portfolioContent";

const STORAGE_KEY = "portfolio-content-v1";

export function getPortfolioContent(): PortfolioContent {
  if (typeof window === "undefined") return DEFAULT_PORTFOLIO_CONTENT;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PORTFOLIO_CONTENT;
    const parsed = portfolioContentSchema.safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : DEFAULT_PORTFOLIO_CONTENT;
  } catch {
    return DEFAULT_PORTFOLIO_CONTENT;
  }
}

export function savePortfolioContent(content: PortfolioContent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent("portfolio-content-updated"));
}

export function resetPortfolioContent() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("portfolio-content-updated"));
}

export function usePortfolioContent() {
  const [content, setContent] = useState<PortfolioContent>(() => getPortfolioContent());
  const savedContent = trpc.portfolio.get.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (savedContent.data) setContent(savedContent.data);
  }, [savedContent.data]);

  useEffect(() => {
    if (savedContent.error) {
      toast.error("Impossible de charger le contenu sauvegardé", {
        description: savedContent.error.message,
      });
    }
  }, [savedContent.error]);

  useEffect(() => {
    const refresh = () => setContent(getPortfolioContent());
    window.addEventListener("portfolio-content-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("portfolio-content-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return { content, setContent };
}
