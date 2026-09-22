# AnyBlog — Blog Platform

Modern full-stack blog platform built with Next.js 16 (App Router), React 19, Prisma 7 + PostgreSQL, and Cloudinary. Create, edit, and publish markdown blogs with live preview, image upload, comments, categories, view statistics, and JWT-cookie authentication.

## Features

- **Auth** — Signup / login with `argon2` hashing + `jsonwebtoken` in an `httpOnly` cookie. Protected routes via `proxy.ts:4` (guards `/create/*`, `/edit/*` with JWT verify only; per-page DB checks live in `create/page.tsx` and `edit/.../page.tsx`). `POST /api/user/check-user` powers client auth islands.
- **Blog CRUD** — Create (`POST /api/blog/new`, multipart form → Cloudinary → `prisma.post.create`), read (`app/(shared)/blog/[userId]/[slug]/page.tsx`, infinite feed via `GET /api/blog/get-post`), update (`PUT /api/blog/update` — uploads to Cloudinary only if a new `File` is sent), delete (`POST /api/blog/delete`, owner or ADMIN).
- **View counting without dupes** — `components/blog/BlogObserver.tsx` (`"use client"`, `IntersectionObserver` sentinel with `threshold: 0.5`, once-per-mount) renders `"The end"` at the bottom of each post and fires `POST /api/blog/view` once. The route dedupes with a `blog-view:<postId>` cookie (`maxAge` 24h) and upserts both `PostStatistic.readers` and the author's `UserStatistic.readers`.
- **Statistics** — `PostStatistic` and `UserStatistic` models (`readers`, `like`, `dislike`, `shared`). Profile page shows readers/likes/dislikes; users listing shows post count + readers.
- **Feed** — Home (`app/(shared)/page.tsx`) loads 10 posts server-side, `components/post/PostFeed.tsx` appends more via `IntersectionObserver` sentinel (`/api/blog/get-post?skip=&take=10`).
- **Comments** — `POST /api/blog/create-comment`, rendered with `BlogCommentCard.tsx` + `BlogCommentForm.tsx`.
- **Categories** — `PostCategory` (`name` + `color`), linked to posts, shown as colored `Badge`s.
- **Live edit + preview** — `EditBlog.tsx` (client) lifts `react-hook-form` state to feed `BlogPreview.tsx` and `EditBlogForm.tsx` simultaneously; create flow mirrors it in `CreateBlogForm.tsx`.
- **Markdown** — `@mdxeditor/editor` toolbar (headings, lists, tables, code blocks via CodeMirror language packs, images, links) + `react-markdown` with `remark-gfm`, `rehype-raw`, `rehype-highlight` in `components/layout/Markdown.tsx`.
- **Images** — `cloudinary` `upload_stream` with 5MB limit validated by `zod` (`app/schemas/createBlog.ts`) + server-side check; served via `next.config.ts` remotePatterns (`res.cloudinary.com`, `picsum.photos`, `i.pinimg.com`).
- **Profiles** — Avatar/banner update/delete (`PUT /api/user/update-profile`, `update-banner`, `delete-profile`, `delete-banner`), profile page `app/(shared)/profile/[username]/page.tsx`, creators listing `app/(shared)/users/page.tsx` (uses `_count` for post counts, no over-fetch).
- **Validation** — `zod` + `@hookform/resolvers` in `app/schemas/` (`auth.ts`, `blog.ts`, `createBlog.ts`), `slugify` for slugs.
- **UI** — `shadcn/ui` + Tailwind CSS 4 + `next-themes` (dark mode), `sonner` toasts, responsive layout with mobile navbar, skeleton states (`BlogCardSkeleton`, `BlogImageSkeleton`), Vercel Analytics + Speed Insights in `app/layout.tsx`.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.12 (App Router), React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind 4, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `@tailwindcss/typography` |
| DB / ORM | PostgreSQL (`pg` 8.22), Prisma 7.9.1 + `@prisma/adapter-pg` (`lib/db.ts` singleton) |
| Auth | `jsonwebtoken` 9, `argon2` 0.45 |
| Upload | `cloudinary` 2.10, `next-cloudinary` 6.18 |
| Forms | `react-hook-form` 7.84, `zod` 4.4, `@hookform/resolvers` 5.7 |
| Editor | `@mdxeditor/editor` 4.2, `@codemirror/*` language packs, `react-markdown` 10, `rehype-highlight`, `rehype-raw`, `remark-gfm`, `highlight.js` |
| UI | `shadcn`, `@base-ui/react`, `lucide-react`, `sonner` |
| Observability | `@vercel/analytics`, `@vercel/speed-insights` |

## Project Structure

```
app/
  (shared)/                              # shared layout (NavBar + Footer)
    page.tsx                             # home feed (server fetch 10 + PostFeed)
    create/page.tsx                      # auth check -> CreateBlogForm
    edit/[userId]/[slug]/page.tsx        # auth + owner/ADMIN check -> EditBlog
    blog/[userId]/[slug]/page.tsx        # post detail + comments + BlogObserver sentinel
    profile/[username]/page.tsx          # profile card + stats + user posts
    users/page.tsx                       # creators grid (select + _count)
  auth/
    login/page.tsx
    signup/page.tsx
  api/
    auth/ (login, signup, logout)
    blog/ (new, update, delete, get-post, create-comment, view)
    user/ (check-user, update-profile, update-banner, delete-profile, delete-banner)
  schemas/ (auth.ts, blog.ts, createBlog.ts)
components/
  blog/ (BlogCard, BlogCardSkeleton, BlogImageSkeleton, BlogPreview,
    BlogObserver, CreateBlogForm, EditBlog, EditBlogForm, BlogMenu,
    BlogSearch, BlogCommentCard, BlogCommentForm, DeleteBlogMenuItem)
  post/ (PostFeed — infinite scroll)
  profile/ (ProfileImageMenu, ChangeProfileImage, DeleteProfileImage,
    ProfileBannerMenu, ChangeBannerImage, DeleteBannerImage, ShareProfile)
  navbar/ (NavbarItem, NavbarItemMobile, NavbarProfile, LogoutMenuItem)
  middleware/ (CheckTokenAndReturn — cheap JWT-cookie check for NavBar)
  layout/ (NavBar, Footer, Markdown, theme-toggle)
  ui/ (shadcn: card, button, field, avatar, attachment, dropdown-menu, empty, etc.)
lib/
  db.ts                  # PrismaClient + PrismaPg adapter singleton
  cloudinary.ts          # cloudinary v2 config
  auth.ts                # getToken() JWT helper
  server/ (token.ts, username.ts)
  utils.ts               # formatDate, formatNumber, cn
  generated/prisma/      # Prisma Client output
prisma/
  schema.prisma          # User, UserStatistic, Post, PostComment, PostCategory, PostStatistic
  migrations/
  seed.ts + seed/
proxy.ts                 # auth guard for /create/*, /edit/* (JWT verify only)
next.config.ts           # images remotePatterns (cloudinary, picsum, pinimg)
```

## Data Models

```prisma
// prisma/schema.prisma (excerpt)
enum userRole {
  ADMIN
  USER
}

model User {
  id             String          @id @default(uuid())
  profilePicture String?         @default("/default-avatar.png")
  bannerPicture  String?         @default("/default-banner.png")
  name           String          @db.VarChar(20)
  username       String?         @unique @db.VarChar(30)
  email          String          @unique
  password       String
  role           userRole        @default(USER)
  shortDesc      String          @default("AnyBlog Writer")
  post           Post[]
  comment        PostComment[]
  statistic      UserStatistic[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

model UserStatistic {
  user    User   @relation(fields: [userId], references: [id])
  userId  String @id
  readers Int    @default(0)
  like    Int    @default(0)
  dislike Int    @default(0)
  shared  Int    @default(0)
}

model Post {
  id          String         @id @default(cuid())
  image       String
  title       String
  slug        String // slugify(title, { lower: true })
  description String // 40-300 chars
  content     String // markdown
  published   Boolean        @default(false)
  author      User           @relation(fields: [authorId], references: [id])
  authorId    String
  comments    PostComment[]
  categories  PostCategory[]
  statistic   PostStatistic[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model PostStatistic {
  post    Post   @relation(fields: [postId], references: [id])
  postId  String @id
  readers Int    @default(0)
  like    Int    @default(0)
  dislike Int    @default(0)
  shared  Int    @default(0)
}

model PostComment {
  id        String   @id @default(cuid())
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  comment   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PostCategory {
  id    String @id @default(cuid())
  name  String
  color String
  post  Post[]
}
```

## Getting Started

### Prerequisites

- Node.js 18+ / pnpm (repo contains `pnpm-workspace.yaml` + `pnpm-lock.yaml`)
- PostgreSQL database (local or Prisma Postgres)
- Cloudinary account

### 1. Install

```bash
pnpm install
# or npm install
```

### 2. Environment

Copy `.env.example` to `.env` in the project root:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/POSTGRES_DATABASE_NAME"
NODE_ENV= # "development" || "production"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JWT_SECRET=
```

### 3. Database

```bash
# generate client (output to lib/generated/prisma)
npx prisma generate

# create & run migrations
npx prisma migrate dev --name init

# optional: open Studio
npx prisma studio
```

Or with Prisma Postgres quick start: `npx create-db` (see `prisma/schema.prisma:4`).

### 4. Run

```bash
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm start    # serve build
pnpm lint
```

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | no | Create user, set `jwt` cookie |
| POST | `/api/auth/login` | no | Verify credentials, set `jwt` cookie |
| POST | `/api/auth/logout` | yes | Clear cookie |
| POST | `/api/blog/new` | yes | `multipart/form-data` title, description, content, image (File) → Cloudinary → `prisma.post.create` |
| PUT | `/api/blog/update` | yes | Same fields + `postId`; uploads only if `file instanceof File && size > 0`, else keeps existing `image` |
| POST | `/api/blog/delete` | yes | Delete by `postId` (owner or ADMIN) |
| GET | `/api/blog/get-post` | no | Infinite-feed pagination (`?skip=&take=`), used by `PostFeed` |
| POST | `/api/blog/create-comment` | yes | Add a comment to a post |
| POST | `/api/blog/view` | no | `{ postId }` → cookie-deduped (`blog-view:<postId>`, 24h) increment of `PostStatistic` + author `UserStatistic` |
| POST | `/api/user/check-user` | — | Lightweight session check for client islands |
| PUT | `/api/user/update-profile` | yes | Upload new avatar |
| PUT | `/api/user/update-banner` | yes | Upload new banner |
| PUT | `/api/user/delete-profile` | yes | Reset to `/default-avatar.png` |
| PUT | `/api/user/delete-banner` | yes | Reset to `/default-banner.png` |

## Key Patterns

**Dedupe view counting:** blog detail page only reads `statistic[0]?.readers ?? 0`. Writes happen in `POST /api/blog/view`, fired once by `BlogObserver` when its end-of-article sentinel intersects (`threshold: 0.5`, `observer.disconnect()` + `hasViewed` guard). Double clicks / refreshes within 24h hit the cookie early-return, so no dupe increments.

**Infinite scroll:** `PostFeed.tsx` keeps `posts` + `skip` state and observes a loader `div` (`rootMargin: 200px`). Each intersection fetches the next page from `/api/blog/get-post`.

**Live preview (edit/create):** detail pages are Server Components (fetch `initialPost` + `user`), the client container (`EditBlog.tsx` / `CreateBlogForm.tsx`) owns `useForm<BlogFormValues>`. `form.watch()` feeds `BlogPreview` while the form component receives the same `form` object.

**Conditional upload:** `app/api/blog/update/route.ts` guards with `file instanceof File && file.size > 0` before `cloudinary.uploader.upload_stream`. Prisma update conditionally spreads the new image URL.

**Cheap navbar auth:** `CheckTokenAndReturn` only verifies the JWT cookie (no DB). Heavy user lookups stay in page-level server components or client islands.

**Validation:** `app/schemas/createBlog.ts` — title max 100, description 40–300, image 5MB + `jpeg/png/webp`.

**Prisma singleton:** `lib/db.ts` caches `PrismaClient` on `global` in dev and uses the `PrismaPg` adapter with `DATABASE_URL`.

## Deployment

- Vercel-ready (`next.config.ts` images remotePatterns already configured)
- Set env vars in Vercel dashboard
- Use `DATABASE_URL` from hosted Postgres (Neon, Supabase, Prisma Postgres)

## License

Persona; learning project.
