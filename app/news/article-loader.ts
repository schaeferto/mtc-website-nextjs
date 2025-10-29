import { NewsArticle } from "./types";

// Import all articles
import { ligaAuftakt } from "./articles/2025/2025-05-10-liga-auftakt";
import { news100x100 } from "./articles/2024/2024-01-24-100x100";
import { allgaeuTriathlon2024 } from "./articles/2024/2024-08-18-allgaeu-triathlon";
import { schongauLandesliga } from "./articles/2024/2024-07-21-schongau-landesliga";
import { challengeRoth2024 } from "./articles/2024/2024-07-07-challenge-roth";
import { ironmanWorldChampionships2024 } from "./articles/2024/2024-12-14-ironman-world-championships";
import { schwimmtrainingslager } from "./articles/2024/2024-01-10-schwimmtrainingslager";
// New articles
import { newAllgaeu } from "./articles/2025/2025-08-17-new-allgaeu";
import { ligaHerrenAmmersee } from "./articles/2025/2025-07-12-liga-herren-ammersee";
import { ligaHerrenOberschleissheim } from "./articles/2025/2025-05-25-liga-herren-oberschleissheim";
import { ligaMixedSchongauNew } from "./articles/2025/2025-07-27-liga-herren-schongau-new";
import { ligaMixedHof } from "./articles/2025/2025-07-13-liga-mixed-hof";
import { suedkaernten } from "./articles/2025/2025-09-14-suedkaernten";
import { toskana } from "./articles/2025/2025-04-06-toskana";
import { pizza } from "./articles/2025/2025-10-27-pizza";

// You'll need to add new articles here as you create them
export const allArticles: NewsArticle[] = [
  // New articles (2025)
  newAllgaeu,
  ligaHerrenAmmersee,
  ligaHerrenOberschleissheim,
  ligaMixedSchongauNew,
  pizza,
  ligaMixedHof,
  suedkaernten,
  toskana,
  // Existing articles
  ligaAuftakt,
  news100x100,
  allgaeuTriathlon2024,
  schongauLandesliga,
  challengeRoth2024,
  ironmanWorldChampionships2024,
  schwimmtrainingslager,
  // Add more new articles here
];

// Helper function to get articles sorted by date (newest first)
export function getArticles(): NewsArticle[] {
  return allArticles
    .slice() // Create a copy to avoid mutating the original
    .sort((a, b) => {
      // Articles without dates go to the end
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;

      // Sort by date descending (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

// Helper function to get a single article by ID
export function getArticleById(id: string): NewsArticle | undefined {
  return allArticles.find((article) => article.id === id);
}

// Helper function to get a single article by slug
export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return allArticles.find((article) => article.slug === slug);
}
