// Template for new articles - copy this file and modify
import placeholderImage from "@/public/news_placeholder.png";
import { NewsArticle } from "../types";

export const templateArticle: NewsArticle = {
  id: "unique-article-id", // Use kebab-case, should be unique
  slug: "article-slug", // Used for URLs if needed
  image: { 
    src: placeholderImage, // Replace with your image import
    height: 400, // Replace with actual image dimensions
    width: 600 
  },
  header: "Article Title",
  text: [
    "First paragraph of your article...",
    "Second paragraph...",
    "You can use a single string instead of array for single paragraph"
  ],
  date: "2025-10-26", // Format: YYYY-MM-DD (optional)
};

// Steps to create a new article:
// 1. Copy this file with a new name (e.g., "my-new-article.ts")
// 2. Import your image file and update the image object
// 3. Update all the content fields
// 4. Add the import and export to article-loader.ts
// 5. The article will automatically appear on the news page