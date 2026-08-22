# Blog Platform

Modern full-stack blog platform built with Next.js 16 (App Router), React 19, Prisma 7 + PostgreSQL, and Cloudinary. Create, edit, and publish markdown blogs with live preview, image upload, and JWT authentication.

## Features

- **Auth** - Signup / Login with `argon2` hashing + `jsonwebtoken` stored in `httpOnly` cookie, protected routes via `proxy.ts:5`
- **Blog CRUD** - Create (`app/api/blog/new/route.ts:7`), Read (`app/(shared)/blog/[userId]/[slug]/page.tsx`), Update (`app/api/blog/update/route.ts:7` - conditional Cloudinary upload only if new `File` is sent), Delete (`app/api/blog/delete/route.ts`)
- **Live Edit + Preview** - Client container `components/blog/EditBlog.tsx:23` lifts `react-hook-form` state to feed `BlogPreview.tsx:16` and `EditBlogForm.tsx` simultaneously
- **Markdown** - `@mdxeditor/editor` with toolbar (headings, lists, tables, code blocks via CodeMirror, images, links) + `react-markdown` + `rehype-highlight` rendering in `components/layout/Markdown.tsx`
- **Image Upload** - `cloudinary` `upload_stream` with 5MB limit, validated by `zod` (`app/schemas/createBlog.ts:3`) and server-side check, served via `next.config.ts:5` remotePatterns (`res.cloudinary.com`, `i.pinimg.com`)
- **User Profiles** - Avatar / banner update/delete (`app/api/user/update-profile`, `update-banner`, `delete-profile`, `delete-banner`), profile page `app/(shared)/profile/[slug]/page.tsx`, users listing
- **Validation** - `zod` + `@hookform/resolvers` (`zodResolver`), `slugify` for unique `authorId+slug` constraint
- **UI** - `shadcn/ui` + `Tailwind CSS 4` + `next-themes`, `sonner` toasts, responsive layout

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.12 (App Router), React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind 4, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `@tailwindcss/typography` |
| DB / ORM | PostgreSQL, Prisma 7.9.1 + `@prisma/adapter-pg` (`lib/db.ts:1`) |
| Auth | `jsonwebtoken` 9, `argon2` 0.45 |
| Upload | `cloudinary` 2.10, `next-cloudinary` 6.18 |
| Forms | `react-hook-form` 7.84, `zod` 4.4, `@hookform/resolvers` |
| Editor | `@mdxeditor/editor` 4.2, `@codemirror/*`, `react-markdown` 10, `rehype-highlight`, `remark-gfm` |
| UI | `shadcn` 4.16, `lucide-react`, `sonner` |

## Project Structure

```
app/
  (shared)/              # public + protected shared layout (NavBar)
    page.tsx             # feed / home
    create/page.tsx      # -> CreateBlogForm (Server fetches user, Client form)
    edit/[userId]/[slug]/page.tsx -> EditBlog (live preview)
    blog/[userId]/[slug]/page.tsx
    profile/[slug]/page.tsx
    users/page.tsx
  auth/
    login/ page.tsx
    signup/ page.tsx
  api/
    auth/ (login, signup, logout)
    blog/ (new, update, delete)
    user/ (update-profile, update-banner, delete-*)
  schemas/ (createBlog.ts, auth.ts)
components/
  blog/ (BlogCard, BlogPreview, CreateBlogForm, EditBlog, EditBlogForm, BlogMenu, BlogSearch)
  profile/ (ProfileImageMenu, ChangeProfileImage, etc.)
  layout/ (NavBar, Markdown)
  ui/ (shadcn: card, button, field, avatar, attachment, etc.)
lib/
  db.ts                  # PrismaClient + PrismaPg adapter
  cloudinary.ts
  generated/prisma/      # Prisma Client output
prisma/
  schema.prisma          # User, Post models + userRole enum
proxy.ts                 # auth guard for /create/*, /edit/*
next.config.ts
```

## Data Models

```prisma
// prisma/schema.prisma:20
model User {
  id String @id @default(uuid())
  name String @db.VarChar(20)
  email String @unique
  password String
  role userRole @default(USER) // ADMIN | USER
  profilePicture String? @default("/default-avatar.png")
  bannerPicture String? @default("/default-banner.png")
  post Post[]
}

model Post {
  id String @id @default(cuid())
  title String
  slug String              // slugify(title, {lower:true})
  description String      // 40-300 chars
  content String          // markdown
  image String            // Cloudinary secure_url
  authorId String
  author User @relation(fields: [authorId], references: [id])
}
```

## Getting Started

### Prerequisites

- Node.js 18+ / pnpm
- PostgreSQL database (local or Prisma Postgres)
- Cloudinary account

### 1. Install

```bash
pnpm install
# or npm install
```

### 2. Environment

Create `.env` in project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"
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
| POST | `/api/auth/login` | no | Verify, set `jwt` cookie |
| POST | `/api/auth/logout` | yes | Clear cookie |
| POST | `/api/blog/new` | yes | `multipart/form-data` title, description, content, image(File) -> Cloudinary -> `prisma.post.create` |
| PUT | `/api/blog/update` | yes | Same fields + `postId`; uploads only if `file instanceof File && size>0`, else keeps existing `image` (`...imageUrl?{image}:{} `) |
| POST | `/api/blog/delete` | yes | Delete by `postId` (owner or ADMIN) |
| POST | `/api/user/update-profile` | yes | Upload new avatar |
| POST | `/api/user/update-banner` | yes | Upload new banner |
| POST | `/api/user/delete-profile` | yes | Reset to `/default-avatar.png` |
| POST | `/api/user/delete-banner` | yes | Reset to `/default-banner.png` |

## Key Patterns

**Live preview (Edit):** Page is `Server` (fetches `initialPost` + `user`), passes to `EditBlog.tsx:23` (`"use client"`) which owns `useForm<BlogFormValues>`. `form.watch()` feeds `BlogPreview` props and `EditFormCard` receives `form: UseFormReturn<BlogFormValues>`.

**Conditional upload:** `app/api/blog/update/route.ts:47` guards with `file instanceof File && file.size>0` before `cloudinary.uploader.upload_stream`. Prisma update conditionally spreads `image`.

**Validation:** `app/schemas/createBlog.ts:6` - title max 100, description 40-300, image 5MB + `jpeg/png/webp`.

## Deployment

- Vercel-ready (`next.config.ts` images remotePatterns already configured)
- Set env vars in Vercel dashboard
- Use `DATABASE_URL` from hosted Postgres (Neon, Supabase, Prisma Postgres)

## License

Private learning project.
