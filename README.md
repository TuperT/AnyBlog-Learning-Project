# Blog Platform

Modern full-stack blog platform built with Next.js 16 (App Router), React 19, Prisma 7 + PostgreSQL, and Cloudinary. Create, edit, and publish markdown blogs with live preview, image upload, comments, categories, and JWT authentication.

## Features

- **Auth** - Signup / Login with `argon2` hashing + `jsonwebtoken` stored in `httpOnly` cookie, protected routes via `proxy.ts:5` (guards `/create/*`, `/edit/*`, verifies JWT + DB user)
- **Blog CRUD** - Create (`app/api/blog/new/route.ts`), Read (`app/(shared)/blog/[userId]/[slug]/page.tsx`, `app/api/blog/get-post/route.ts`), Update (`app/api/blog/update/route.ts` — conditional Cloudinary upload only if a new `File` is sent), Delete (`app/api/blog/delete/route.ts`, owner or ADMIN)
- **Comments** - Create via `app/api/blog/create-comment/route.ts`, rendered with `components/blog/BlogCommentCard.tsx` + `BlogCommentForm.tsx`
- **Categories** - `PostCategory` model (`name` + `color`), linked to posts
- **Live Edit + Preview** - Client container `components/blog/EditBlog.tsx` lifts `react-hook-form` state to feed `BlogPreview.tsx` and `EditBlogForm.tsx` simultaneously
- **Markdown** - `@mdxeditor/editor` with toolbar (headings, lists, tables, code blocks via CodeMirror, images, links) + `react-markdown` + `rehype-highlight` / `remark-gfm` rendering in `components/layout/Markdown.tsx`
- **Image Upload** - `cloudinary` `upload_stream` with 5MB limit, validated by `zod` (`app/schemas/createBlog.ts`) and server-side check, served via `next.config.ts` remotePatterns (`res.cloudinary.com`, `i.pinimg.com`)
- **User Profiles** - Avatar / banner update/delete (`app/api/user/update-profile`, `update-banner`, `delete-profile`, `delete-banner`), profile page `app/(shared)/profile/[slug]/page.tsx`, users listing
- **Validation** - `zod` + `@hookform/resolvers` (`zodResolver`) in `app/schemas/` (`auth.ts`, `blog.ts`, `createBlog.ts`), `slugify` for slugs
- **UI** - `shadcn/ui` + `Tailwind CSS 4` + `next-themes` (dark mode), `sonner` toasts, responsive layout with mobile navbar

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.12 (App Router), React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind 4, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `@tailwindcss/typography` |
| DB / ORM | PostgreSQL, Prisma 7.9.1 + `@prisma/adapter-pg` (`lib/db.ts`) |
| Auth | `jsonwebtoken` 9, `argon2` 0.45 |
| Upload | `cloudinary` 2.10, `next-cloudinary` 6.18 |
| Forms | `react-hook-form` 7.84, `zod` 4.4, `@hookform/resolvers` 5.7 |
| Editor | `@mdxeditor/editor` 4.2, `@codemirror/*` language packs, `react-markdown` 10, `rehype-highlight`, `rehype-raw`, `remark-gfm` |
| UI | `shadcn`, `lucide-react`, `sonner`, `@base-ui/react` |

## Project Structure

```
app/
  (shared)/              # shared layout (navbar)
    page.tsx             # feed / home (PostFeed)
    create/page.tsx      # -> CreateBlogForm (server fetches user, client form)
    edit/[userId]/[slug]/page.tsx -> EditBlog (live preview)
    blog/[userId]/[slug]/page.tsx  # post detail + comments
    profile/[slug]/page.tsx
    users/page.tsx
  auth/
    login/page.tsx
    signup/page.tsx
  api/
    auth/ (login, signup, logout)
    blog/ (new, update, delete, get-post, create-comment)
    user/ (update-profile, update-banner, delete-*)
  schemas/ (auth.ts, blog.ts, createBlog.ts)
components/
  blog/ (BlogCard, BlogCardSkeleton, BlogImageSkeleton, BlogPreview,
    CreateBlogForm, EditBlog, EditBlogForm, BlogMenu, BlogSearch,
    BlogCommentCard, BlogCommentForm, DeleteBlogMenuItem)
  post/ (PostFeed)
  profile/ (ProfileImageMenu, ChangeProfileImage, DeleteProfileImage,
    ProfileBannerMenu, ChangeBannerImage, DeleteBannerImage)
  navbar/ (NavbarItem, NavbarItemMobile, NavbarProfile, LogoutMenuItem)
  middleware/ (CheckTokenAndReturn)
  layout/ (Markdown, theme-toggle, ...)
  ui/ (shadcn: card, button, field, avatar, attachment, etc.)
lib/
  db.ts                  # PrismaClient + PrismaPg adapter (singleton)
  cloudinary.ts          # cloudinary v2 config
  auth.ts
  utils.ts
  generated/prisma/      # Prisma Client output
prisma/
  schema.prisma          # User, Post, PostComment, PostCategory + userRole enum
proxy.ts                 # auth guard for /create/*, /edit/*
next.config.ts           # images remotePatterns (cloudinary, pinimg)
```

## Data Models

```prisma
// prisma/schema.prisma
enum userRole {
  ADMIN
  USER
}

model User {
  id             String        @id @default(uuid())
  profilePicture String?       @default("/default-avatar.png")
  bannerPicture  String?       @default("/default-banner.png")
  name           String        @db.VarChar(20)
  email          String        @unique
  password       String
  role           userRole      @default(USER)
  post           Post[]
  comment        PostComment[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model Post {
  id          String         @id @default(cuid())
  image       String
  title       String
  slug        String         // slugify(title, { lower: true })
  description String         // 40-300 chars
  content     String         // markdown
  published   Boolean        @default(false)
  author      User           @relation(fields: [authorId], references: [id])
  authorId    String
  comments    PostComment[]
  categories  PostCategory[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
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
NODE_ENV="development"
JWT_SECRET="your-super-secret-jwt-key"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
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
| GET/POST | `/api/blog/get-post` | — | Fetch a single post |
| POST | `/api/blog/create-comment` | yes | Add a comment to a post |
| POST | `/api/user/update-profile` | yes | Upload new avatar |
| POST | `/api/user/update-banner` | yes | Upload new banner |
| POST | `/api/user/delete-profile` | yes | Reset to `/default-avatar.png` |
| POST | `/api/user/delete-banner` | yes | Reset to `/default-banner.png` |

## Key Patterns

**Live preview (Edit):** Page is a Server Component (fetches `initialPost` + `user`), passes to `EditBlog.tsx` (`"use client"`) which owns `useForm<BlogFormValues>`. `form.watch()` feeds `BlogPreview` props while `EditBlogForm` receives `form: UseFormReturn<BlogFormValues>`.

**Conditional upload:** `app/api/blog/update/route.ts` guards with `file instanceof File && file.size > 0` before `cloudinary.uploader.upload_stream`. Prisma update conditionally spreads the new image.

**Validation:** `app/schemas/createBlog.ts` — title max 100, description 40–300, image 5MB + `jpeg/png/webp`.

**Prisma singleton:** `lib/db.ts` caches `PrismaClient` on `global` in dev and uses `PrismaPg` adapter with `DATABASE_URL`.

## Deployment

- Vercel-ready (`next.config.ts` images remotePatterns already configured)
- Set env vars in Vercel dashboard
- Use `DATABASE_URL` from hosted Postgres (Neon, Supabase, Prisma Postgres)

## License

Private learning project.
