# Admin Panel Responsive Design Checklist

Use this checklist when adding or changing admin UI so the panel stays consistent across mobile and web.

## Breakpoints

- **lg (1024px)** is the main layout switch: below = bottom nav + no sidebar; at/above = fixed sidebar + no bottom nav.
- Use **sm** / **lg** for padding and gap scale (e.g. `px-4 sm:px-6 lg:px-8`, `space-y-6 sm:space-y-8`).
- Use **useIsMobile()** (max-width: 1023px) for conditional UI (card list vs table, sheet side).

## Spacing scale

| Context       | Mobile   | sm (640+)     | lg (1024+) |
|--------------|----------|---------------|------------|
| Main content | px-4 py-4 | sm:px-6 sm:py-6 | lg:px-8 lg:py-6 |
| Section gaps | gap-4    | sm:gap-6      | lg:gap-8   |
| Card padding | p-4      | sm:p-5 / sm:p-6 | lg:p-6   |
| Page header  | px-4 pt-4 pb-3 | sm:px-6 sm:pt-5 | lg:px-8 lg:pt-6 |

Main layout already applies horizontal padding; content views should not add extra horizontal padding (use `space-y-6 sm:space-y-8` for section gaps).

## Touch and accessibility

- **Touch targets:** Buttons and interactive elements must be at least **44×44px** on mobile (`min-h-[44px] min-w-[44px]`).
- **Inputs:** Use `text-base` (16px) for primary inputs on mobile to avoid iOS zoom on focus.
- **Safe areas:** Header uses `pt-[env(safe-area-inset-top)]`; BottomNav and main use `pb-[env(safe-area-inset-bottom)]` or `pb-[max(5rem,env(safe-area-inset-bottom))]`.

## Overflow

- Use **min-w-0** on flex/grid children that can shrink (cards, chart containers).
- Use **max-w-full** on images and iframes to prevent horizontal overflow.

## Page titles

- Use a single scale for h1: `text-xl sm:text-2xl lg:text-3xl` (e.g. in PageHeader).
