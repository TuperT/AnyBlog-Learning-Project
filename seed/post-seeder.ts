import "dotenv/config";
import argon2 from "argon2";
import slugify from "slugify";
import type { PrismaClient } from "../lib/generated/prisma/client";

type SeedPost = {
    title: string;
    description: string;
    content: string;
    image: string;
    categories: string[];
};

const CATEGORIES = [
    { name: "UI/UX Design", color: "#3B82F6" },
    { name: "Engineering", color: "#F59E0B" },
    { name: "Tutorial", color: "#10B981" },
] as const;

const POSTS: SeedPost[] = [
    {
        title: "Building Scalable Design Systems for Resilient Multi-Platform Apps",
        description:
            "A pragmatic deep dive into unified semantic design tokens, cross-platform components, and governance that keeps product teams fast without breaking consistency.",
        content: `## Why design systems fail

Most design systems fail not because of tooling, but because of **governance**. Tokens drift, components fork, and suddenly you maintain five button variants.

## Start with semantic tokens

\`\`\`css
:root {
  --color-surface: oklch(0.985 0.004 247.8);
  --color-primary: #0058be;
}
\`\`\`

> A token is a contract between design and engineering. Name it by purpose, not value.

## Checklist

- [x] Audit existing components
- [ ] Define semantic color roles
- [ ] Document contribution rules
`,
        image: "https://picsum.photos/seed/anyblog-design-system/1200/800",
        categories: ["UI/UX Design"],
    },
    {
        title: "Getting Started with Markdown: From Headings to Code Blocks",
        description:
            "Learn the Markdown essentials used in this blog — headings, lists, tables, and fenced code blocks with syntax highlighting, all editable in the built-in editor.",
        content: `## Headings and emphasis

You can mix **bold**, *italic*, and \`inline code\` freely.

## Code blocks

\`\`\`ts
export const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};
\`\`\`

## Tables

| Feature      | Supported |
| ------------ | --------- |
| Headings     | Yes       |
| Code blocks  | Yes       |
| Tables       | Yes       |

Try editing this post to see the live preview in action.
`,
        image: "https://picsum.photos/seed/anyblog-markdown/1200/800",
        categories: ["Tutorial"],
    },
    {
        title: "PostgreSQL Indexing Strategies That Actually Move the Needle",
        description:
            "B-tree, GIN, partial, and covering indexes explained with query plans — plus the two index anti-patterns I see in almost every code review.",
        content: `## Measure first

Always start with \`EXPLAIN (ANALYZE, BUFFERS)\` before adding an index.

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM "Post"
WHERE "authorId" = 'user_123'
ORDER BY "createdAt" DESC
LIMIT 10;
\`\`\`

## Rules of thumb

1. Index foreign keys and common **WHERE** columns.
2. Prefer **partial indexes** for soft-deleted or filtered queries.
3. A covering index beats two narrow ones for hot paths.

> Indexes speed up reads but tax every write. Index with intent.
`,
        image: "https://picsum.photos/seed/anyblog-postgres/1200/800",
        categories: ["Engineering"],
    },
    {
        title: "Dark Mode Done Right: Tokens, Contrast, and Code Blocks",
        description:
            "How semantic color tokens make theming trivial, why hardcoded white surfaces leak through, and how to keep syntax highlighting readable in both modes.",
        content: `## Tokenize everything

Hardcoded colors are tech debt. Every surface should resolve through a token:

\`\`\`css
.cm-editor {
  background-color: var(--card);
  color: var(--card-foreground);
}
\`\`\`

## Contrast checklist

- Body text at **4.5:1** minimum.
- Muted text never below **3:1** for large text.
- Test syntax tokens in *both* themes — light-tuned palettes wash out on dark surfaces.
`,
        image: "https://picsum.photos/seed/anyblog-dark-mode/1200/800",
        categories: ["UI/UX Design", "Engineering"],
    },
    {
        title: "Next.js Server Components: Where Data Fetching Belongs",
        description:
            "Async Server Components, client boundaries, and the one import-chain mistake that turns your server component into a client component.",
        content: `## The rule

Only Server Components can be \`async\`. The moment a \`"use client"\` module imports your component — even transitively — it becomes a client component and \`async\` is illegal.

## The fix pattern

\`\`\`tsx
"use client";

export const Menu = ({ postId }: { postId: string }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/user/check-user", {
      method: "POST",
      body: JSON.stringify({ postId }),
    })
      .then((r) => r.json())
      .then(setData);
  }, [postId]);

  if (!data) return null;
  // ...
};
\`\`\`

Fetch on the client when the component lives under a client boundary.
`,
        image: "https://picsum.photos/seed/anyblog-rsc/1200/800",
        categories: ["Engineering", "Tutorial"],
    },
    {
        title: "Seeding Realistic Demo Content with Prisma",
        description:
            "Idempotent seeds with upserts, relation connects, and hashed passwords — so every fresh clone boots with a believable blog in one command.",
        content: `## Make seeds re-runnable

Use \`upsert\` keyed on a stable unique field (like \`slug\`) so running the seed twice never duplicates rows.

\`\`\`ts
await prisma.post.upsert({
  where: { slug },
  update: {},
  create: { title, slug, content, authorId, image },
});
\`\`\`

Run it with:

\`\`\`bash
npx prisma db seed
\`\`\`
`,
        image: "https://picsum.photos/seed/anyblog-seeding/1200/800",
        categories: ["Tutorial"],
    },
    {
        title: "Tailwind CSS v4: Theme Tokens and Dark Mode Without the Pain",
        description:
            "CSS-first configuration, custom variants, and OKLCH color tokens — a practical tour of the Tailwind v4 features this very blog runs on.",
        content: `## CSS-first config

Tailwind v4 moves configuration into CSS with \`@theme\`. No more config file archaeology:

\`\`\`css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));
@theme inline {
  --color-card: var(--card);
  --color-primary: var(--primary);
}
\`\`\`

## Why OKLCH?

OKLCH is perceptually uniform — tweaking lightness never shifts the hue on you, unlike HSL.

> Define surfaces once as tokens, and dark mode becomes a variable swap instead of a rewrite.
`,
        image: "https://picsum.photos/seed/anyblog-tailwind/1200/800",
        categories: ["UI/UX Design", "Tutorial"],
    },
    {
        title: "JWT Auth with httpOnly Cookies in Next.js App Router",
        description:
            "Signup, login, and route protection with jsonwebtoken and argon2 — plus the proxy guard pattern that keeps /create and /edit logged-in only.",
        content: `## The flow

1. Hash passwords with **argon2** — never store plaintext.
2. Sign a JWT and set it as an \`httpOnly\` cookie.
3. Guard routes in \`proxy.ts\` by verifying the cookie.

\`\`\`ts
const token = request.cookies.get("jwt")?.value;
if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));

const decoded = jwt.verify(token, process.env.JWT_SECRET!);
\`\`\`

> \`httpOnly\` keeps the token out of reach of injected scripts — a meaningful XSS mitigation for session cookies.
`,
        image: "https://picsum.photos/seed/anyblog-auth/1200/800",
        categories: ["Engineering"],
    },
    {
        title: "Image Uploads with Cloudinary Upload Streams",
        description:
            "From multipart form data to a hosted secure_url in one hop — handling 5MB limits, MIME validation, and conditional re-uploads on edit.",
        content: `## Upload via stream

Buffer the file in memory, then pipe it into Cloudinary's upload stream:

\`\`\`ts
const buffer = Buffer.from(await file.arrayBuffer());
await new Promise((resolve, reject) => {
  cloudinary.uploader
    .upload_stream({ folder: "blogs" }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
    .end(buffer);
});
\`\`\`

## On edit, skip unchanged images

Only upload when the incoming value is a real \`File\` with size > 0 — otherwise keep the stored URL.
`,
        image: "https://picsum.photos/seed/anyblog-uploads/1200/800",
        categories: ["Engineering", "Tutorial"],
    },
    {
        title: "Designing Empty States Users Don't Hate",
        description:
            "Empty feeds, zero search results, and fresh accounts — turning dead ends into guidance with illustration, copy, and one clear action.",
        content: `## Every empty state needs three things

1. **What happened** — "There are no blogs yet."
2. **Why it matters** — one line of context.
3. **What next** — a single primary action like *Create Blog*.

> An empty state is a first impression. This blog's feed shows one before the first post exists — seed data just makes it less lonely.
`,
        image: "https://picsum.photos/seed/anyblog-empty-states/1200/800",
        categories: ["UI/UX Design"],
    },
];

/**
 * Seeds demo categories, a demo author, and demo posts.
 * Safe to run multiple times — everything is keyed on unique fields via upsert.
 */
export async function seedPosts(prisma: PrismaClient) {
    const author = await prisma.user.upsert({
        where: { email: "demo@anyblog.dev" },
        update: {},
        create: {
            name: "Demo Author",
            email: "demo@anyblog.dev",
            password: await argon2.hash("password123"),
        },
    });

    const categoryRecords = await Promise.all(
        CATEGORIES.map((category) =>
            prisma.postCategory.upsert({
                where: { id: category.name },
                update: { color: category.color },
                create: { id: category.name, ...category },
            }),
        ),
    );

    const categoryByName = new Map(categoryRecords.map((c) => [c.name, { id: c.id }]));

    for (const post of POSTS) {
        const slug = slugify(post.title, { lower: true, strict: true });
        const existing = await prisma.post.findFirst({
            where: { slug, authorId: author.id },
            select: { id: true },
        });

        const data = {
            title: post.title,
            slug,
            description: post.description,
            content: post.content,
            image: post.image,
            published: true,
            authorId: author.id,
            categories: {
                connect: post.categories.map((name) => categoryByName.get(name)!),
            },
        };

        if (existing) {
            await prisma.post.update({ where: { id: existing.id }, data });
        } else {
            await prisma.post.create({ data });
        }
    }

    console.log(`Seeded ${POSTS.length} posts as ${author.email}`);
}
