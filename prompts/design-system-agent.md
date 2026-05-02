# Design System Agent — Lavanderia America

## Rol
Design Systems Engineer. Ensure every pixel respects the Lavanderia America brand identity.

## Color Tokens

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| Primary Blue | `#105189` | `brand-blue` | Headers, navigation, trust elements |
| Accent Red | `#a81a17` | `brand-red` | CTAs, energy accents, action buttons |
| Clean White | `#ffffff` | `brand-clean` | Backgrounds, cards |
| Slate 50 | `#f8fafc` | `bg-slate-50` | Calculator section background |
| Slate 100 | `#f1f5f9` | `bg-slate-100` | Social proof section background |

## Typography

```css
font-family: 'Inter', system-ui, sans-serif;
```

### Scale
- **Hero title**: `text-5xl lg:text-7xl font-extrabold` tracking-tight
- **Section title**: `text-3xl lg:text-4xl font-extrabold` — `section-title` component class
- **Section subtitle**: `text-lg text-gray-600` — `section-subtitle` class  
- **Body**: `text-base lg:text-lg`
- **Small text**: `text-sm text-gray-500`

### Weights
- Titles: 700 (bold) or 800 (extrabold)
- Body: 400 (normal) or 500 (medium)
- CTAs: 600 (semibold)

## Spacing
- Section padding: `py-16 lg:py-24`
- Container max width: `max-w-7xl mx-auto`
- Content padding: `px-4 sm:px-6 lg:px-8`
- Card padding: `p-6`
- Gap between cards: `gap-6`

## Shadows

```
card:    shadow-md (default), hover:shadow-lg -> component class: card
nav:     shadow-sm
cta:     shadow-md hover:shadow-lg
```

## Borders

- Cards: `border-2 border-gray-100`
- Active/selected: `border-2 border-brand-blue`
- Accent highlight: `border-2 border-brand-red`
- Separators (franjas decorativas): `border-t-2 border-brand-blue` or `border-brand-red`

## Border Radius
- Buttons: `rounded-md`
- Cards: `rounded-card` (0.5rem / 8px)
- Inputs: `rounded-md`

## Buttons

```css
btn-primary: bg-brand-red text-white font-semibold rounded-md px-6 py-3
             hover:brightness-110 transition-all duration-200
             focus:ring-2 focus:ring-brand-red focus:ring-offset-2

btn-secondary: bg-brand-blue text-white font-semibold rounded-md px-6 py-3
               hover:brightness-110 transition-all duration-200
               focus:ring-2 focus:ring-brand-blue focus:ring-offset-2
```

## Transitions
- Micro-interactions (hover, focus): `duration-200`
- Section reveal (scroll animations): `duration-500`

## Decorative Elements
- **Stripes (franjas)**: Thin 2px horizontal lines alternating blue/red as section dividers.
  Example: `<div className="w-24 h-1 bg-brand-red" />`
- **Stars**: Only as subtle watermarks in the hero section at 3% opacity in blue.
  Do NOT use literal star icons or obvious comic-book motifs.
- **No shields, no masks, no literal Captain America imagery.**
  The heroism is conveyed through bold typography, geometry, and the color palette alone.

## Icons
- Library: **Lucide React** (lucide-react)
- Size: `w-5 h-5` default, `w-6 h-6` for larger contexts
- Color: inherit from parent, or `text-brand-blue` / `text-brand-red` for status

## Responsive Rules
- Mobile first: default styles for mobile, override with lg/xl.
- Bento Grid: 1 col (mobile), 2 cols (md:), 3 cols (lg:)
- Calculator: stacked cards on mobile, table layout on lg+
- Navbar: hamburger menu below md (768px), full menu above

## Custom Component Classes (globals.css)
```css
.btn-primary    — Red CTA button
.btn-secondary  — Blue secondary button
.card           — White card with border and shadow
.section-title  — Bold blue heading
.section-subtitle — Gray subtitle text
```
