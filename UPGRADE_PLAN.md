# Ta-na-mao Upgrade Plan

## 1. Executive Summary

This document outlines a comprehensive upgrade plan for the 'ta-na-mao' classifieds platform. The goal is to transform the current prototype into a fully functional, scalable, and secure application comparable to industry leaders like OLX.com.br.

## 2. Benchmarking: Ta-na-mao vs. OLX.com.br

| Feature | OLX.com.br (Target) | Ta-na-mao (Current) | Gap Analysis |
| :--- | :--- | :--- | :--- |
| **Search** | Advanced filters (Location, Price, Category, Condition), Saved Searches, Alerts. | Basic UI only (no backend functionality). | **Critical**. Needs robust search engine (Postgres Full Text Search or ElasticSearch). |
| **Listings** | Multiple images, Video support, Rich text description, Structured data attributes. | Mock data only. Single image support in UI. | **Critical**. Needs `listings` database table and CRUD operations. |
| **Communication** | Real-time Chat, Push Notifications, Email masking. | None. | **High**. Essential for user retention and privacy. |
| **User Trust** | Reputation System, Verified Profiles, Account Age, Social Login. | Basic Auth (Supabase). No verification. | **High**. crucial for classifieds safety. |
| **Monetization** | Featured Listings (Paid), Bump Up, Ad Limits. | "Featured" is just a UI badge. | **Medium**. Needed for business sustainability. |
| **Mobile Experience** | Native Apps (iOS/Android), PWA. | Responsive Web (Vite/Tailwind). | **Low** (for now). PWA capabilities can be added easily. |

## 3. Technical Audit

### Codebase
*   **Strengths**: Modern stack (React, Vite, Tailwind, Shadcn UI), Clean component structure, TypeScript usage.
*   **Weaknesses**:
    *   **Mock Data Dependency**: Core features rely on hardcoded data.
    *   **Missing Backend Logic**: No database schema for listings.
    *   **Type Safety**: Some "any" or loose typing might exist in rapid prototyping.
    *   **State Management**: Local state usage is fine now, but `React Query` (TanStack Query) should be leveraged more for server state.

### Performance
*   **Current State**: Excellent (due to low complexity).
*   **Risks**: Large image payloads, unoptimized bundle size as features grow.
*   **Optimization Opportunities**:
    *   **Image Optimization**: Use Next.js Image or Cloudinary/Supabase Storage transformations.
    *   **Lazy Loading**: Code splitting for routes (already partially supported by Vite).
    *   **Caching**: Implement stale-while-revalidate strategies with React Query.

### Security
*   **Authentication**: Supabase Auth is secure by default.
*   **Authorization (RLS)**:
    *   *Current*: Basic profiles RLS.
    *   *Needed*: Strict RLS for `listings` (only owner can edit/delete).
*   **Data Validation**:
    *   *Current*: Minimal.
    *   *Needed*: Zod schemas for all inputs (Forms & API).

## 4. UX/UI Improvements

### Interface Enhancements
1.  **"Create Listing" Flow**:
    *   **Current**: Missing.
    *   **Proposal**: Multi-step wizard (Category -> Details -> Photos -> Review).
2.  **Listing Details Page**:
    *   **Current**: Missing.
    *   **Proposal**: Large photo gallery, prominent "Contact Seller" CTA, Safety tips sidebar, "Related Listings" section.
3.  **Search Experience**:
    *   **Current**: Basic input.
    *   **Proposal**: Sticky search bar on mobile, facet sidebar on desktop (Price range slider, specific attributes like "Mileage" for cars).
4.  **User Dashboard**:
    *   **Current**: Basic menu.
    *   **Proposal**: "My Ads" management (Edit, Pause, Delete, Boost).

## 5. Implementation Roadmap

### Phase 1: Core Foundation (Current Focus)
*   [x] Database Schema Design (`listings` table).
*   [ ] Frontend Service Layer (`listingService`).
*   [ ] "Create Listing" Page (Basic).
*   [ ] Listing Details Page.
*   [ ] Connect Home Page to Live/Mock Service.

### Phase 2: User Engagement
*   [ ] User Dashboard ("My Ads").
*   [ ] Favorites / Watchlist.
*   [ ] Basic Search Filters (Category, Price).

### Phase 3: Trust & Safety
*   [ ] Real-time Chat (Supabase Realtime).
*   [ ] User Public Profile (Ratings/Reviews).
*   [ ] Report Listing functionality.

### Phase 4: Scale & Monetization
*   [ ] Image Optimization Pipeline.
*   [ ] SEO (SSR/SSG consideration or Helmet/Meta tags).
*   [ ] Payment Integration (Stripe/Pagar.me) for Featured Ads.
