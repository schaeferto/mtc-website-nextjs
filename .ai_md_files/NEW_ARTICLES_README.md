# Create a News Article — Quick Todo List

Follow this checklist to add a single news article to the website with image optimization.

## 📋 Todo Checklist

- [ ] **1. Optimize image with ffmpeg**

  - Convert image from design folder to `public/news_<slug>.jpg`
  - Scale to max 1920px width, set quality to `-q:v 3`
  - Include date at the beginning of the filename (e.g., `2025-11-23_news_huettenwanderung.jpg`)
  - Command example:
    ```bash
    ffmpeg -i "/home/tobias/projects/MTC/design/fotos/version_2/news/2025-11-30huettenwanderung.jpg" \
           -vf "scale=min(iw\,1920):-1" -q:v 3 \
           "public/2025-11-23_news_huettenwanderung.jpg"
    ```

- [ ] **2. Create article TypeScript file**

  - Create `app/news/articles/2025/2025-11-21-marbella.ts` (use date format YYYY-MM-DD)
  - Use template from `app/news/articles/template.ts`
  - Import the optimized image and fill in title, text, date

- [ ] **3. Register article in loader**

  - Add import to `app/news/article-loader.ts`
  - Add exported article to `allArticles` array

- [ ] **4. Verify and build**
  - Run `pnpm -w build` or `pnpm -w run typecheck` to check for errors
  - Confirm article appears on `/news` page (sorted by newest date first)

## 🎯 Article Template Structure

```typescript
export const articleName: NewsArticle = {
  id: "unique-id",
  slug: "url-slug",
  image: { src: imageImport, height: 2560, width: 1920 },
  header: "Your Title Here",
  text: [
    "First paragraph...",
    "Second paragraph...",
    // Or use single string: "Single paragraph content"
  ],
  date: "2025-10-26", // YYYY-MM-DD format
};
```

## 🖼️ Optimized Images Available

- `public/news_allgaeu.jpg`
- `public/news_liga_h_ammersee.jpg`
- `public/news_liga_h_oberschleissheim.jpg`
- `public/news_liga_h_schongau.jpg`
- `public/news_liga_h_w_hof.jpg`
- `public/news_suedkaernten.jpg`
- `public/news_toskana.jpg`
- `public/news_marbella.jpg` (2025-11-21)
- `public/news_huettenwanderung.jpg` (2025-11-23)

All articles will automatically appear on your `/news` page sorted by date (newest first).

## ✅ Recently Created Articles

- **Marbella Training Camp** (2025-11-21) — `app/news/articles/2025/2025-11-21-marbella.ts`
- **Hüttenwanderung im Schnee** (2025-11-23) — `app/news/articles/2025/2025-11-23-huettenwanderung.ts`
