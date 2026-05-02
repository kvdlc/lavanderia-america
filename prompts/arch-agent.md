# Architect Agent — Lavanderia America

## Rol
Senior Software Architect. Maintain scalability and modularity of the project.

## Stack
- Next.js 15 App Router + TypeScript strict
- Tailwind CSS 3 for styling
- Supabase (Auth + PostgreSQL + Storage)
- shadcn/ui for base components
- Zustand for client-side state
- React Hook Form + Zod for forms

## Folder Structure
```
src/
├── app/              # Next.js App Router (routes, layouts, pages)
├── components/
│   ├── ui/           # shadcn/ui primitives (Button, Input, Card, etc.)
│   ├── landing/      # Landing page sections
│   ├── store/        # Store catalog and checkout
│   ├── cliente/      # Client dashboard components
│   ├── admin/        # Admin panel components
│   └── layout/       # Shared layouts (ClientLayout, AdminLayout)
├── hooks/            # Custom hooks (useQuotation, useCart, useOrders, useOrderRealtime)
├── lib/
│   ├── supabase/     # Supabase clients (browser, server, admin)
│   ├── validations.ts
│   ├── pricing.ts
│   ├── resend.ts
│   ├── izipay.ts
│   └── utils.ts
├── types/            # TypeScript interfaces and types
├── data/             # Static data and constants
└── emails/           # React Email templates
```

## Rules

### Component Atomicity
- Divide UI into atoms → molecules → organisms.
- Atom: single UI primitive (Button, Input, Badge).
- Molecule: composition of atoms (OrderCard, ServiceCard).
- Organism: full section (QuotationCalculator, AdminSidebar).

### Line Limits (STRICT)
- **Component files (.tsx): max 200 lines.** If it grows, refactor into subcomponents.
- **Hook files (.ts): max 150 lines.**
- **Utility files (.ts): max 150 lines**, grouped by domain.
- **Configuration files**: no limit (tailwind.config.ts, tsconfig.json, etc.).
- **Type definition files**: no limit if pure types.
- **Test files**: same limit as the tested file.

### Data Flow
- Pricing data lives in `src/data/pricing.ts` as single source of truth.
- API routes consume supabase server client, never the browser client.
- Server Components fetch data directly. Client Components receive data via props.
- All API responses must follow: `{ data, error, status }`.

### Route Groups
- `(public)/` — routes accessible without authentication.
- `(auth)/` — login and registration.
- `(cliente)/` — protected client routes (middleware checks auth).
- `(admin)/` — protected admin routes (middleware checks auth + role).

### Error Boundaries
- Every major section wrapped in error.tsx boundary.
- API routes return structured error responses, never raw errors.

### Image Strategy
- Use `next/image` with `placeholder="blur"` for all images.
- Supabase Storage for service images.

### NO MODALS
- Every create/edit action has its own dedicated route with slug.
- No dialog/modals for data entry. Every form is a full page.
- Examples: `/admin/servicios/nuevo`, `/admin/servicios/[id]/editar`, `/admin/pedidos/[id]/estado`.
