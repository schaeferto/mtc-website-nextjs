# Authentication Implementation Plan for MTC Website

## Current Project Status
- **Location**: `/home/tobias/projects/MTC/website/nextjs`
- **Framework**: Next.js 15.1.2 with App Router
- **Current Build**: All static pages (○ symbol in build output)
- **Hosting**: Vercel
- **Status**: Production-ready static site with video scaling fix applied

## Key Learning: How Next.js Deployment Works

### Current Setup (All Static)
```
Build Output: ○ (Static) - prerendered as static content
Deployment: HTML + JS bundles → CDN → Fast & cheap
```

### With Server Components (Mixed)
```
Build Output: ƒ (Dynamic) - server-rendered on demand  
Deployment: Static pages → CDN, Dynamic pages → Serverless functions
```

**Key Insight**: Vercel automatically handles both static and dynamic pages with zero configuration changes!

## Authentication Options Analysis

### Recommended: NextAuth.js (Auth.js)
- ✅ **Free**: Open source
- ✅ **Next.js optimized**: Built specifically for Next.js
- ✅ **Multiple providers**: Google, GitHub, Email, etc.
- ✅ **Automatic Vercel deployment**: No config needed

### Alternative: Firebase Auth (Client-side)
- ✅ **Keeps site static**: Client-side only
- ✅ **Free tier**: Good limits
- ✅ **Simple**: No server components needed

### Alternative: Supabase Auth
- ✅ **Free tier**: 50k MAU
- ✅ **Database included**: Row-level security
- ✅ **Good DX**: Easy to implement

## Implementation Plan (NextAuth.js)

### Step 1: Install Dependencies
```bash
npm install next-auth@beta
```

### Step 2: Create Auth Configuration
```
lib/auth.ts              # Auth configuration
app/api/auth/[...nextauth]/route.ts  # API routes
middleware.ts            # Route protection
```

### Step 3: Implement Components
```
app/login/page.tsx       # Login page
app/dashboard/page.tsx   # Protected member area
components/auth/         # Login/logout components
```

### Step 4: Set Up Providers
- Google OAuth (recommended first)
- Email/password (optional)
- Environment variables for OAuth keys

## Deployment Impact
- **Static pages**: Stay static (○) - no change
- **Auth pages**: Become dynamic (ƒ) - handled automatically by Vercel
- **Cost**: Still fits in free tier for small clubs
- **Performance**: Static pages unaffected, auth pages ~200-500ms

## Use Cases for MTC
- Member login portal
- Training schedule access  
- Event registration
- Members-only news/updates
- Contact list access

## Next Session Tasks
1. Choose authentication provider (Google OAuth recommended)
2. Set up OAuth credentials
3. Implement NextAuth.js configuration
4. Create login/dashboard pages
5. Add protection to member areas
6. Test and deploy

## Technical Notes
- Current build: All pages static
- Video scaling issue: Fixed (added `w-full h-full` to video component)
- Project uses Tailwind CSS for styling
- React Icons for UI elements

## Environment Setup for Next Session
```bash
cd /home/tobias/projects/MTC/website/nextjs
npm run dev  # Start development server
```

Ready to implement when you return! 🚀
