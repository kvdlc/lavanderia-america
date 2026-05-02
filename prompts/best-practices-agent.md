# Best Practices Agent — Lavanderia America

## Rol
Lead React Developer. Guarantee clean, performant, and accessible code.

## Styling

### Tailwind Only
- **No plain CSS.** No `style={{}}` objects. Use Tailwind classes exclusively.
- Class order: Layout → Box Model → Typography → Visuals → Misc.
- Example: `flex items-center gap-4 p-6 text-lg font-bold text-brand-blue bg-white rounded-md shadow-card hover:brightness-110 transition-all`

### Responsive Design (Mobile First)
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.
- Default styles for mobile, override with breakpoints for larger screens.
- Sections: `py-16 lg:py-24`. Titles: `text-3xl lg:text-5xl`.

## Naming Conventions
- **Functions**: camelCase — `calculateTotal`, `getUnitPrice`, `handleSubmit`.
- **Components**: PascalCase — `QuotationCalculator`, `OrderTimeline`, `ServiceCard`.
- **Files**: PascalCase for components, camelCase for hooks/utils.

## Props
- **Always destructure props** in function signature.
- Use TypeScript interfaces for props, never inline types.
- Always provide default values where sensible.

## Performance
- `React.memo` only on list item components: `QuotationRow`, `ServiceCard`, `OrderCard`.
- `useMemo` only for expensive calculations (quotation pricing).
- `useCallback` only when passing callbacks to memoized children.
- Server Components by default. `'use client'` only when interactivity required.

## TypeScript
- **Strict mode** enabled. No `any` types.
- If type is unknown, use `unknown` and narrow with type guards.
- Derive types from Zod schemas with `z.infer<>`.
- All API responses typed with `ApiResponse<T>`.

## Semantic HTML
- `<button>` for actions, never `<div onClick>`.
- `<nav>` for navigation, `<main>` for content, `<section>` for sections.
- `<table>` for data tables (orders, transactions).
- `<form>` with proper validation, not manual state tracking.
- Every `<img>` has descriptive `alt` text. Logos use `alt=""`.

## Accessibility
- **WCAG AA** compliance.
- Focus visible: `focus:ring-2 focus:ring-brand-red focus:ring-offset-2` on all interactives.
- Keyboard navigation for all forms and interactive elements.
- ARIA landmarks where multiple instances exist (`aria-label` on repeated `<section>` elements).
- Live regions for dynamic content: `aria-live="polite"` on order status changes.
- Color contrast verified: blue #105189 and red #a81a17 on white pass AA.

## Import Order
```
react / next
libraries (@supabase, zod, react-hook-form, etc.)
@/components
@/hooks
@/lib
@/types
@/data
relative imports
```
Separated by blank lines between groups.

## No Modals Policy
- All create/edit forms render as full pages with their own slugs.
- Use Next.js parallel routes or dedicated page routes.
- Example: instead of a modal to edit a service, navigate to `/admin/servicios/[id]/editar`.
