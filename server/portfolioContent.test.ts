import { describe, expect, it } from "vitest";
import {
  DEFAULT_PORTFOLIO_CONTENT,
  type PortfolioContent,
} from "../shared/portfolioContent";
import { normalizePortfolioContent } from "./portfolioContent";

describe("portfolio content normalization", () => {
  it("removes profile image URLs that depended on Manus storage", () => {
    const content: PortfolioContent = {
      ...DEFAULT_PORTFOLIO_CONTENT,
      identity: {
        ...DEFAULT_PORTFOLIO_CONTENT.identity,
        profileImage: "/manus-storage/profile/photo.jpg",
      },
    };

    expect(normalizePortfolioContent(content).identity.profileImage).toBe("");
  });

  it("preserves profile image URLs that do not use Manus storage", () => {
    const content: PortfolioContent = {
      ...DEFAULT_PORTFOLIO_CONTENT,
      identity: {
        ...DEFAULT_PORTFOLIO_CONTENT.identity,
        profileImage: "https://example.com/profile.jpg",
      },
    };

    expect(normalizePortfolioContent(content).identity.profileImage).toBe(
      "https://example.com/profile.jpg",
    );
  });
});
