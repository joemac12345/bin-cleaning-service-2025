# Design System - Bin Cleaning Service

This document outlines the design patterns and styling conventions used in the booking confirmation page, which should be applied consistently across the application.

## Design Philosophy

- **Minimal & Clean**: Flat design with no unnecessary decorations
- **Mobile-First**: Optimized for mobile devices, scales up for desktop
- **Left-Aligned**: Content flows naturally from left, no centered layouts
- **Single Color Palette**: Blue primary + Gray/Black neutral only

---

## Color Palette

### Primary Color
- **Blue**: `bg-blue-600` / `#2563eb`
  - Used for: Primary CTAs, hero backgrounds, active states
  - Hover: `bg-blue-700` / `#1d4ed8`

### Neutral Colors
- **White**: `bg-white` / `#ffffff` - Page backgrounds
- **Gray 50**: `bg-gray-50` / `#f9fafb` - Subtle backgrounds (AVOID - too light)
- **Gray 100**: `bg-gray-100` / `#f3f4f6` - Card backgrounds, secondary buttons
- **Gray 200**: `bg-gray-200` / `#e5e7eb` - Borders, dividers
- **Gray 300**: `bg-gray-300` / `#d1d5db` - Hover states for gray buttons
- **Gray 500**: `text-gray-500` / `#6b7280` - Secondary text, labels
- **Gray 600**: `text-gray-600` / `#4b5563` - Body text
- **Gray 900**: `text-gray-900` / `#111827` - Headings, important text, dark accents
- **Black**: `bg-gray-900` - High contrast elements (step numbers, alert boxes)

### Colors to AVOID
- ❌ Green, Purple, Yellow, Orange - Stick to blue + neutrals only
- ❌ Pastels (blue-50, green-50) - Too decorative
- ❌ Gradients - Flat design only

---

## Typography

### Headings
```tsx
// Page Title (H1)
className="text-xl font-bold text-white"  // In hero sections
className="text-xl font-bold text-gray-900"  // In content

// Section Heading (H2)
className="text-xl font-bold text-gray-900 mb-4"

// Subsection Heading (H3)
className="text-base font-bold text-gray-900 mb-3"

// Small Heading
className="font-bold text-gray-900 mb-1"
```

### Body Text
```tsx
// Primary text
className="text-sm text-gray-600 leading-relaxed"

// Secondary text / descriptions
className="text-sm text-white/90"  // On colored backgrounds
className="text-sm text-gray-300"  // On dark backgrounds

// Labels / metadata
className="text-xs text-gray-500 uppercase tracking-wider font-medium"

// Buttons
className="text-xs font-semibold"  // For compact buttons
className="text-sm font-semibold"  // For regular buttons
```

---

## Layout Patterns

### Page Container
```tsx
<div className="min-h-screen bg-white">
  <div className="px-4 py-8 max-w-3xl mx-auto">
    {/* Content */}
  </div>
</div>
```

### Hero Section (Compact)
```tsx
<div className="bg-blue-600">
  <div className="px-4 py-6 max-w-3xl mx-auto">
    <div className="flex items-center gap-4">
      {/* Icon + Content + Reference */}
    </div>
  </div>
</div>
```

**Key Properties:**
- `py-6` - Compact vertical padding (not py-16)
- `flex items-center` - Horizontal layout
- `gap-4` - Spacing between elements
- Left-aligned content flow

### Content Sections
```tsx
<div className="mb-8">
  <h2 className="text-xl font-bold text-gray-900 mb-4">
    Section Title
  </h2>
  {/* Section content */}
</div>
```

**Spacing:**
- Between sections: `mb-8`
- Below headings: `mb-4` (large), `mb-3` (medium), `mb-1` (small)

---

## Component Patterns

### Cards (Content Blocks)
```tsx
// Light card
<div className="bg-gray-100 p-4">
  {/* Content */}
</div>

// Dark card (for emphasis)
<div className="bg-gray-900 text-white p-4">
  {/* Content */}
</div>
```

**Rules:**
- ❌ NO borders
- ❌ NO shadows (except buttons)
- ❌ NO rounded corners
- ✅ Flat backgrounds only
- ✅ Adequate padding: `p-4` or `p-5`

### Buttons

#### Primary Button (Blue)
```tsx
<button className="w-28 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md">
  <Icon className="w-3.5 h-3.5" />
  Label
</button>
```

#### Secondary Button (Gray)
```tsx
<button className="w-28 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md">
  <Icon className="w-3.5 h-3.5" />
  Label
</button>
```

**Button Sizing:**
- Compact: `w-28` (112px), `py-2`, `text-xs`, icon `w-3.5 h-3.5`
- Regular: `w-36` (144px), `py-2.5`, `text-sm`, icon `w-4 h-4`
- Full-width: `w-full`, `py-3`, `text-sm`

**Button Rules:**
- ✅ Always include shadow: `shadow-md`
- ✅ Transition colors: `transition-colors`
- ✅ Icon + text layout: `flex items-center justify-center gap-1.5`
- ❌ NO rounded corners
- ❌ NO borders

### Carousel Pattern
```tsx
<div className="-mx-4 px-4">
  <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
    {/* Buttons with flex-shrink-0 */}
  </div>
</div>

{/* Add to page styles */}
<style jsx global>{`
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>
```

**Carousel Items:**
- Must have: `flex-shrink-0` (prevents squishing)
- Must have: `snap-start` (snap to position)
- Spacing: `gap-3`

### Dividers
```tsx
<div className="h-px bg-gray-200 mb-4"></div>
```

### Step/Number Badges
```tsx
<span className="w-6 h-6 bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
  {number}
</span>
```

### Icon Boxes
```tsx
// Compact icon in hero
<div className="w-14 h-14 bg-white flex items-center justify-center flex-shrink-0">
  <Icon className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
</div>

// Icon in button
<Icon className="w-3.5 h-3.5" strokeWidth={2} />

// Icon in content
<Icon className="w-5 h-5" strokeWidth={2} />
```

---

## Spacing System

Use Tailwind's spacing scale consistently:

- **Tiny**: `gap-1.5`, `mb-1` - Between icon and text
- **Small**: `gap-3`, `mb-3` - Between related items
- **Medium**: `gap-4`, `mb-4`, `p-4` - Standard spacing
- **Large**: `mb-8`, `py-8` - Between sections
- **Extra Large**: `py-16` - ❌ AVOID (too much space)

---

## Responsive Design

### Mobile-First Approach
Start with mobile styles, enhance for desktop:

```tsx
// Mobile (default)
className="px-4 py-8"

// Desktop (if needed)
className="px-4 py-8 lg:px-8"
```

### Carousel on Mobile
Perfect for multiple actions that don't fit side-by-side on mobile screens.

---

## Animation & Transitions

### Keep It Minimal
```tsx
// Button hover
className="transition-colors"

// NO animations like:
// ❌ animate-bounce
// ❌ animate-pulse
// ❌ animate-spin (except loading states)
```

---

## Icons

**Source:** Lucide React
```tsx
import { CheckCircle, Mail, Phone, Home, Bell } from 'lucide-react';
```

**Sizing:**
- Small (buttons): `w-3.5 h-3.5`
- Medium (content): `w-5 h-5`
- Large (hero): `w-8 h-8`

**Stroke Width:**
- Default: `strokeWidth={2}`
- Bold (hero): `strokeWidth={2.5}`

---

## Examples from Thank You Page

### ✅ Good Practices
1. Compact hero with inline reference
2. Carousel for multiple actions
3. Flat cards with clear hierarchy
4. Single color palette (blue + gray)
5. Left-aligned content
6. Mobile-optimized button sizes
7. Clear visual hierarchy with font weights

### ❌ Avoid
1. Centered layouts (except hero on mobile)
2. Multiple brand colors
3. Rounded corners
4. Shadows on cards (only on buttons)
5. Gradients
6. Decorative elements
7. Excessive vertical spacing

---

## Quick Reference: Class Combinations

### Hero Title
```
text-xl font-bold text-white mb-1
```

### Section Heading
```
text-xl font-bold text-gray-900 mb-4
```

### Card
```
bg-gray-100 p-4 mb-8
```

### Primary Button (Compact)
```
w-28 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md
```

### Secondary Button (Compact)
```
w-28 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md
```

### Body Text
```
text-sm text-gray-600 leading-relaxed
```

### Label/Meta
```
text-xs text-gray-500 uppercase tracking-wider font-medium
```

---

## Implementation Checklist

When creating a new page with this design system:

- [ ] Use `bg-white` for page background
- [ ] Compact hero section with `py-6` (not py-16)
- [ ] Left-aligned content, no centering
- [ ] Only blue (#2563eb) and gray colors
- [ ] No rounded corners on any elements
- [ ] No borders on cards
- [ ] Shadows only on buttons (`shadow-md`)
- [ ] Use carousel for multiple actions on mobile
- [ ] Consistent spacing: `mb-8` between sections
- [ ] Mobile-first responsive design
- [ ] Flat design - no gradients or decorative elements

---

## Notes

This design system prioritizes **clarity, functionality, and mobile usability** over decorative elements. Keep it minimal, keep it flat, keep it blue and gray.
