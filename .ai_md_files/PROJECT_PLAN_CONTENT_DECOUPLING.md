# Project Plan: Content Decoupling & Asset Management System

**Version**: 1.0  
**Date**: December 12, 2025  
**Status**: Planning  
**Priority**: High

---

## 1. Executive Summary

Currently, the MTC website stores all static assets (images, news articles) and content definitions directly in the application code. This creates tight coupling between content and deployment, making it difficult to update content without redeploying the main application.

This project proposes a decoupled architecture where:

- The **main website** remains static and only loads pre-built assets
- A **separate admin dashboard** manages all content (images, articles, metadata) in a database
- A **content delivery system** serves static assets to the main website
- Content updates don't require redeploying the main application

---

## 2. Current State Analysis

### 2.1 Current Architecture

```
Main Website (Next.js)
├── Content defined in TypeScript files
│   └── /app/news/articles/
│       ├── 2024/
│       ├── 2025/
│       └── Each article imports its own image
├── Images stored in /public
│   └── Directly referenced in article TypeScript files
└── No separation between content and application code
```

### 2.2 Current Workflow for Adding Content

1. Create new article TypeScript file
2. Import image from `/public`
3. Define article metadata in TypeScript object
4. Add import/export to `article-loader.ts`
5. Commit and push changes
6. Trigger rebuild and redeploy main website

### 2.3 Current Pain Points

- **Tight Coupling**: Content changes require code changes and redeployment
- **No Multi-User Management**: Only developers can add/edit content
- **Version Control Bloat**: Every image and article file creates git history overhead
- **No Scheduling**: Can't schedule content releases
- **No Drafts**: No way to prepare content without publishing
- **Limited Content Types**: Difficult to add new content formats or metadata
- **Scaling Issues**: As content grows, so does the codebase complexity

### 2.4 Current Content Structure

```typescript
// Example: article.ts
type NewsArticle = {
  id: string;
  image: { src: StaticImageData; width: number; height: number };
  header: string;
  text: string | string[];
  date?: string;
  releaseDate?: string;
  slug?: string;
};
```

---

## 3. Proposed Architecture

### 3.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Admin Dashboard                         │
│         (New - Protected Auth, React/Next.js)               │
│  - Upload images                                             │
│  - Create/Edit articles                                      │
│  - Manage metadata                                           │
│  - Draft/Publish workflow                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │ (API calls)
┌──────────────────▼──────────────────────────────────────────┐
│                 Backend/CMS API                              │
│        (New - Node.js/Express or similar)                   │
│  - Authentication & Authorization                           │
│  - Content CRUD operations                                  │
│  - Image upload & storage (S3/Vercel Blob)                 │
│  - Database (PostgreSQL/MongoDB)                            │
│  - Content versioning & scheduling                          │
└──────────────┬──────────────────┬──────────────────────────┘
               │ (Static export)  │ (Real-time API)
┌──────────────▼──┐      ┌────────▼──────────────────────────┐
│   Static JSON   │      │    Main Website (Next.js)         │
│   Exports       │      │   (Current - Simplified)          │
│   (Build time)  │      │  - Fetch content from API/JSON   │
└─────────────────┘      │  - Render articles                │
                         │  - Display images                 │
                         │  - No content code                │
                         └────────────────────────────────────┘
```

### 3.2 Key Components

#### 3.2.1 Backend/CMS API

**Purpose**: Central management of all content and assets

**Technology Options**:

- Node.js (Express) - Lightweight, JavaScript ecosystem
- Next.js API Routes - Leverage existing Next.js knowledge
- Headless CMS (Sanity, Strapi) - Full-featured but more opinionated

**Recommended**: Next.js API Routes (keep stack unified)

**Features**:

- REST API endpoints for content management
- Image upload & optimization
- User authentication (JWT, OAuth)
- Database abstraction layer
- Content validation
- Draft/Published state management
- Scheduled content releases

**Database**: PostgreSQL (or MongoDB)

- Content versioning
- User management
- Media metadata
- Publishing schedules

#### 3.2.2 Admin Dashboard

**Purpose**: User-friendly interface for non-developers to manage content

**Technology**: Next.js + React (component library like Shadcn or Material-UI)

**Features**:

- Drag-and-drop image uploads
- Rich text editor for articles
- WYSIWYG preview
- Media library/gallery
- Article list with filtering
- Draft/Publish workflow
- Scheduled publishing
- User role management (Editor, Admin)
- Audit logs

**Pages/Views**:

- `/admin/login` - Authentication
- `/admin/dashboard` - Overview
- `/admin/articles` - Article management
- `/admin/articles/new` - Create article
- `/admin/articles/[id]/edit` - Edit article
- `/admin/media` - Image/media management
- `/admin/settings` - Configuration
- `/admin/users` - User management

#### 3.2.3 Updated Main Website

**Purpose**: Lightweight, content-agnostic static site

**Changes**:

- Remove all content TypeScript files
- Remove image imports from code
- Fetch content from CMS API at build time OR runtime
- Simplify content types
- Offload image serving to CDN

**Deployment Options**:

1. **Static Generation (Recommended)**

   - Build-time: Fetch all content from CMS API
   - Generate static pages using `getStaticProps` or `generateStaticParams`
   - Rebuild scheduled (e.g., hourly) when content changes
   - Benefits: Fast, cached, CDN-friendly

2. **Incremental Static Regeneration (ISR)**

   - Cache content for set period
   - Regenerate on-demand when content updates
   - Benefits: Automatic updates without full rebuild

3. **Client-Side Rendering**
   - Fetch content at runtime
   - Benefits: Instant updates
   - Drawbacks: SEO impact, slower initial load

---

## 4. Implementation Phases

### Phase 1: Foundation & Backend (Weeks 1-3)

#### 1.1 Setup Backend Infrastructure

- [ ] Create new backend project (Next.js API Routes or separate API service)
- [ ] Setup PostgreSQL database
- [ ] Create database schema for content and users
- [ ] Setup environment configuration

#### 1.2 Implement Core API Endpoints

- [ ] Setup Clerk authentication for backend
- [ ] Implement token verification middleware
- [ ] Articles CRUD endpoints
  - `POST /api/articles` - Create (requires auth)
  - `GET /api/articles` - List (public)
  - `GET /api/articles/[id]` - Get single (public)
  - `PUT /api/articles/[id]` - Update (requires auth)
  - `DELETE /api/articles/[id]` - Delete (requires auth)
- [ ] Articles search/filter endpoints
- [ ] Draft/Published state management
- [ ] Soft delete & archive functionality

#### 1.3 Implement Image Management

- [ ] Image upload endpoint with validation
- [ ] Image optimization (resize, compress)
- [ ] Storage integration (Vercel Blob or S3)
- [ ] Image metadata tracking
- [ ] Image deletion with cleanup

#### 1.4 Database Schema

**Users Table**

```
id (clerk_user_id), role (editor/admin), created_at, updated_at
Note: Name and email come from Clerk, not stored here
```

**Articles Table**

```
id, title, slug, content, status (draft/published),
featured_image_id, created_at, updated_at, published_at,
scheduled_publish_at, author_id
```

**Images Table**

```
id, filename, url, alt_text, width, height, file_size,
mime_type, storage_path, created_at, updated_at
```

**ArticleImages Table**

```
id, article_id, image_id, position
```

### Phase 2: Admin Dashboard (Weeks 4-6)

#### 2.1 Setup Admin Project

- [ ] Create new Next.js project for admin
- [ ] Setup Clerk authentication
- [ ] Protect routes with Clerk middleware
- [ ] Create layout and navigation structure
- [ ] Setup API client library (axios, fetch wrapper)

#### 2.2 Build Core Admin Features

- [ ] Login page
- [ ] Dashboard overview
- [ ] Article management
  - List view with pagination
  - Create/Edit form
  - Image picker/uploader
  - Rich text editor integration
  - Publish/Draft toggle
  - Delete with confirmation
- [ ] Media library
  - Upload images
  - Browse/search
  - Delete with cleanup
  - Alt text management

#### 2.3 Advanced Features

- [ ] Scheduled publishing
- [ ] Content versioning/history
- [ ] User management
- [ ] Audit logs
- [ ] Bulk operations

### Phase 3: Main Website Migration (Weeks 7-8)

#### 3.1 Refactor Content Loading

- [ ] Update data fetching strategy
- [ ] Create content type definitions from API schema
- [ ] Replace hardcoded articles with API calls
- [ ] Handle image URLs from API

#### 3.2 Update Build Pipeline

- [ ] Implement static generation from API
- [ ] Setup ISR if needed
- [ ] Update deployment process
- [ ] Test with live content

#### 3.3 Cleanup

- [ ] Remove old article TypeScript files
- [ ] Remove old image files (archive first)
- [ ] Update documentation
- [ ] Remove unused dependencies

### Phase 4: Testing & Deployment (Week 9)

#### 4.1 Integration Testing

- [ ] End-to-end workflow tests
- [ ] Content publication flow
- [ ] Image upload & display
- [ ] Authentication & authorization
- [ ] Performance testing

#### 4.2 Deployment

- [ ] Deploy backend/CMS API
- [ ] Deploy admin dashboard
- [ ] Deploy updated main website
- [ ] Setup monitoring & alerting
- [ ] Create runbooks

#### 4.3 Migration

- [ ] Export existing content from code
- [ ] Import into database
- [ ] Verify all content appears correctly
- [ ] Train users on admin dashboard

---

## 5. Technology Stack

### Backend/CMS API

**Option A: Next.js API Routes** (Recommended)

```json
{
  "core": ["next.js", "typescript", "node.js"],
  "auth": ["@clerk/nextjs"],
  "database": ["postgresql", "prisma"],
  "file-storage": ["@vercel/blob", "sharp"],
  "validation": ["zod", "joi"],
  "cors": ["cors"],
  "env": ["dotenv"]
}
```

**Option B: Express + TypeScript**

```json
{
  "core": ["express", "typescript", "node.js"],
  "auth": ["@clerk/express"],
  "database": ["postgresql", "prisma"],
  "file-storage": ["multer", "aws-sdk", "sharp"],
  "validation": ["joi", "class-validator"],
  "api": ["swagger", "ts-rest"]
}
```

### Admin Dashboard

```json
{
  "core": ["next.js", "react", "typescript"],
  "auth": ["@clerk/nextjs"],
  "ui": ["shadcn/ui", "tailwindcss"],
  "forms": ["react-hook-form", "zod"],
  "editor": ["slate", "tiptap"],
  "upload": ["react-dropzone"],
  "api-client": ["swr", "react-query"]
}
```

### Main Website (Updated)

```json
{
  "core": ["next.js", "react", "typescript"],
  "styling": ["tailwindcss"],
  "content-fetching": ["fetch-api", "swr"]
}
```

---

## 6. API Specification

### 6.1 Authentication (Delegated to Auth Service)

Instead of managing passwords and user authentication yourself, use a dedicated auth provider:

**Recommended Options:**

1. **Auth0** (Production-Ready, Enterprise)

   - Fully managed authentication
   - Multi-factor authentication
   - Social login (Google, GitHub, etc.)
   - Role-based access control (RBAC)
   - Audit logs included
   - Free tier: up to 7,500 users

2. **Clerk** (Modern, Developer-Friendly)

   - React components out-of-the-box
   - Built-in Next.js integration
   - Organizations and roles support
   - Email & social login
   - Free tier: up to 10,000 users
   - Great UX

3. **NextAuth.js** (Open Source, Lightweight)
   - Self-hosted or managed via NextAuth.js Pro
   - OAuth providers supported
   - Works great with Next.js
   - Database optional (can use credentials)
   - No vendor lock-in

**Recommended: Clerk** (Best for this use case)

- Simple integration with Next.js
- Built-in organization support for admin dashboard
- Role management built-in
- Excellent documentation

**Architecture with Auth Service:**

```
Admin Dashboard
├── Uses Clerk SDK for authentication
├── No password storage needed
└── User management delegated to Clerk

Backend/CMS API
├── Validates Clerk tokens
├── Extracts user info from token
├── Enforces permissions/roles
└── No password database needed

Database
├── Only stores user_id (from Clerk)
├── Stores user role (editor/admin)
├── Stores article metadata (not auth data)
└── No sensitive auth info
```

**No Auth Endpoints Needed - Clerk Handles:**

- User registration
- Login/logout
- Multi-factor authentication
- Session management
- Password reset

**Your API Only Needs:**

- Middleware to verify Clerk tokens
- Role/permission checks on endpoints

### 6.2 Articles Endpoints

```
GET /api/articles
Query params: ?status=published&sort=date&page=1&limit=10
Returns: { articles: [...], total: number, pages: number }

GET /api/articles/:id
Returns: { article: {...} }

POST /api/articles
Headers: { Authorization: "Bearer jwt-token" }
Body: {
  "title": "Article Title",
  "content": "Article content...",
  "status": "draft",
  "featured_image_id": "image-id",
  "scheduled_publish_at": "2025-12-15T10:00:00Z"
}
Returns: { article: {...} }

PUT /api/articles/:id
Headers: { Authorization: "Bearer jwt-token" }
Body: { ...article fields... }
Returns: { article: {...} }

DELETE /api/articles/:id
Headers: { Authorization: "Bearer jwt-token" }
Returns: { success: true }

PATCH /api/articles/:id/publish
Headers: { Authorization: "Bearer jwt-token" }
Returns: { article: {...} }
```

### 6.3 Images/Media Endpoints

```
POST /api/media/upload
Headers: { Authorization: "Bearer jwt-token" }
Body: FormData with file
Returns: { image: { id, url, width, height, ... } }

GET /api/media
Query params: ?sort=date&page=1&limit=20
Returns: { images: [...], total: number }

DELETE /api/media/:id
Headers: { Authorization: "Bearer jwt-token" }
Returns: { success: true }

PUT /api/media/:id
Headers: { Authorization: "Bearer jwt-token" }
Body: { "alt_text": "Updated alt text" }
Returns: { image: {...} }
```

---

## 7. Best Practices & Architecture Decisions

### 7.1 Content Decoupling Best Practices

1. **Separation of Concerns**

   - Admin dashboard is completely separate from main website
   - Backend serves as single source of truth
   - Main website is content-agnostic

2. **Content Versioning**

   - Keep article history for rollback capability
   - Track who made changes and when
   - Allow reverting to previous versions

3. **Image Optimization**

   - Optimize images server-side during upload
   - Store multiple sizes (thumbnail, medium, full)
   - Use modern formats (WebP, AVIF)
   - Serve from CDN

4. **Caching Strategy**

   ```
   Admin API:
   - No caching (always fresh)

   Public API (Main Website):
   - Cache articles for 1 hour
   - Cache images with long TTL (30 days)
   - Invalidate cache on publish
   - Use ETags for conditional requests
   ```

5. **Security**
   - Clerk handles password security (salting, hashing, etc.)
   - No sensitive auth data stored in your database
   - Admin API behind Clerk token verification
   - Public API for reading only
   - Rate limiting on public endpoints
   - CORS properly configured
   - Validate & sanitize all inputs
   - Protect against CSRF

### 7.2 Scalability Considerations

1. **Database**

   - Use appropriate indexes on frequently queried columns
   - Implement pagination for large datasets
   - Consider caching layer (Redis) for frequently accessed content
   - Separate read/write databases if needed

2. **File Storage**

   - Use cloud storage (Vercel Blob, S3) instead of server disk
   - Implement CDN for image delivery
   - Compress images on upload
   - Clean up orphaned files

3. **API Design**
   - Use pagination to avoid large responses
   - Implement field selection for flexibility
   - Use webhooks for async operations
   - Queue long-running tasks (image processing)

### 7.3 Deployment Strategy

1. **Infrastructure**

   ```
   Backend/CMS API:
   - Deploy to Vercel (using Next.js) or AWS/Railway/Render
   - Environment: production, staging, development

   Admin Dashboard:
   - Deploy to Vercel
   - Protected behind authentication

   Main Website:
   - Deploy to Vercel (existing)
   - Triggered by CMS API updates
   ```

2. **CI/CD**

   - Automated tests on commit
   - Staging deployment on PR
   - Production deployment on main branch
   - Content sync from CMS to static builds

3. **Monitoring**
   - Monitor API response times
   - Track error rates
   - Monitor database performance
   - Alert on failed deployments

---

## 8. Data Migration Plan

### 8.1 Export Current Content

```typescript
// Script to extract articles from existing TypeScript files
import fs from "fs";

// Load all article files
// Transform them into JSON structure
// Export to migration file
```

### 8.2 Import into Database

```typescript
// Script to:
// 1. Read migration JSON file
// 2. Process images
// 3. Insert articles into database
// 4. Create proper image references
// 5. Verify integrity
```

### 8.3 Rollback Plan

- Keep old content in separate branch
- Database backups before migration
- Test migration in staging first
- Quick rollback procedure documented

---

## 9. Risk Assessment & Mitigation

| Risk                          | Impact | Likelihood | Mitigation                                      |
| ----------------------------- | ------ | ---------- | ----------------------------------------------- |
| Database failure              | High   | Low        | Daily backups, replica database, monitoring     |
| Auth bypass                   | High   | Low        | Security audit, rate limiting, input validation |
| Large file uploads            | Medium | Medium     | Size limits, async processing, cleanup jobs     |
| Performance degradation       | Medium | Medium     | Caching, CDN, database indexing, monitoring     |
| Content loss during migration | High   | Low        | Test in staging, backups, careful scripts       |
| Complexity of integration     | Medium | Medium     | Clear API spec, thorough testing, documentation |

---

## 10. Success Criteria

- [ ] Admin dashboard can create/edit articles without code changes
- [ ] Main website fetches content from CMS API
- [ ] All existing content successfully migrated
- [ ] Admin dashboard fully functional with 10+ users
- [ ] Content updates appear on main website within 5 minutes
- [ ] Image upload and optimization working reliably
- [ ] Authentication and authorization implemented
- [ ] Zero data loss during migration
- [ ] Performance not degraded from current solution
- [ ] Documentation complete and user training done

---

## 11. Future Enhancements

1. **Content Features**

   - Rich media support (videos, embeds)
   - SEO optimization tools
   - Content tagging and categories
   - Related articles suggestions
   - Comments/discussions

2. **Admin Features**

   - Collaborative editing
   - Content approval workflows
   - A/B testing support
   - Analytics integration
   - Bulk import/export

3. **Integration**

   - Webhook support for external systems
   - Social media auto-posting
   - Email newsletters
   - Search indexing (Algolia)
   - CDN integration

4. **Performance**
   - GraphQL API option
   - Content edge caching
   - Incremental Static Regeneration (ISR)
   - Real-time updates via WebSockets

---

## 12. Documentation & Training

### 12.1 Documentation to Create

- [ ] API documentation (OpenAPI/Swagger)
- [ ] Admin dashboard user guide
- [ ] Developer setup guide
- [ ] Deployment runbooks
- [ ] Database schema documentation
- [ ] Architecture diagrams
- [ ] Troubleshooting guide

### 12.2 User Training

- [ ] Video tutorials for admin dashboard
- [ ] Live training sessions
- [ ] FAQ document
- [ ] Quick-start guides

---

## 13. Timeline & Milestones

| Phase                           | Duration    | Milestone                                    |
| ------------------------------- | ----------- | -------------------------------------------- |
| Phase 1: Foundation             | 3 weeks     | ✓ Backend & DB ready, API endpoints working  |
| Phase 2: Admin Dashboard        | 3 weeks     | ✓ Admin dashboard fully functional           |
| Phase 3: Main Website Migration | 2 weeks     | ✓ Content loading from CMS, old code removed |
| Phase 4: Testing & Deployment   | 1 week      | ✓ Everything deployed, data migrated, live   |
| **Total**                       | **9 weeks** | **Project complete**                         |

---

## 14. Appendix: Directory Structure

### Main Website (Updated)

```
nextjs/
├── app/
│   ├── page.tsx          (Home)
│   ├── news/
│   │   ├── page.tsx      (Fetch from API)
│   │   └── [slug]/page.tsx (Dynamic article pages)
│   ├── board/page.tsx
│   ├── sponsors/page.tsx
│   └── training/page.tsx
├── lib/
│   ├── api.ts            (CMS API client)
│   ├── types.ts          (Content types from API)
│   └── cms/
│       ├── articles.ts   (Article fetching logic)
│       └── media.ts      (Image fetching logic)
├── public/               (Only static assets, no content images)
└── package.json
```

### Backend/CMS API (New)

```
cms-api/
├── app/
│   ├── api/
│   │   ├── auth/         (Authentication endpoints)
│   │   ├── articles/     (Article CRUD)
│   │   ├── media/        (Image upload/management)
│   │   └── admin/        (Admin endpoints)
│   └── middleware/       (Auth guards, etc.)
├── lib/
│   ├── db/              (Database client)
│   ├── auth/            (JWT handling)
│   ├── storage/         (File upload logic)
│   └── validation/      (Input validation)
├── scripts/             (Migration scripts)
├── types/               (TypeScript types)
├── prisma/
│   └── schema.prisma    (Database schema)
├── .env.example
└── package.json
```

### Admin Dashboard (New)

```
cms-admin/
├── app/
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── articles/
│   │   │   ├── page.tsx           (List)
│   │   │   ├── new/page.tsx       (Create)
│   │   │   └── [id]/edit/page.tsx (Edit)
│   │   ├── media/page.tsx
│   │   └── settings/page.tsx
│   └── components/
│       ├── ArticleForm.tsx
│       ├── MediaUpload.tsx
│       ├── ArticleList.tsx
│       └── Editor.tsx
├── lib/
│   ├── api-client.ts    (CMS API wrapper)
│   ├── auth.ts          (Auth logic)
│   └── utils.ts
├── public/
└── package.json
```

---

## 15. Contact & Questions

For questions or clarifications about this project plan, please review the risk assessment and future enhancements sections, or reach out with specific concerns.
