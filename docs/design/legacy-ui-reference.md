# Legacy UI reference

These are the exact values from the original TrailVenture frontend (tag `legacy-v1`, `frontend/`). The rebuild copies them unless [the design spec](../specs/2026-09-17-rebuild-design.md) lists a deliberate change.

Screenshots of the running legacy app are in [`baseline/`](baseline/). They are named `<page>-<width>-<theme>.webp`, at 1440 and 390px, in light and dark. The user page is left out because the seed data holds personal details.

## Deliberate deviations
- **No drop shadows.** Every `shadow-*` is removed, and surfaces keep their `border-[1px]`. The scrolled header gets `border-b` instead of `shadow-lg`.
- **No Aceternity `GlowingEffect`** on buttons, and no wrapper `div` around `Button`.
- **Fonts:** Alumni Sans for display type and Geist for UI text, both loaded with `next/font`. DM Sans is dropped. Section headings shrink from `40px / lg:70px extrabold` to `40px / lg:56px semibold`.
- **Spacing and sizing are tuned, not copied:** padding, margins, icon sizes and text sizes are improved wherever the original is cramped or small. This means more generous card padding and section rhythm, `size-5` icons in buttons and pills (instead of `size-4`), and body text no smaller than `text-sm` (no `text-xs` for meaningful content). Layout, structure and components stay the same.
- **Logo:** the original had only a text wordmark and a stock favicon. The rebuild adds the Summit mark (a teal tile with a two-peak ridge, `web/src/components/brand/logo.tsx`) next to the Alumni Sans wordmark, plus a matching favicon and app icons.
- **Off-black:** ink and dark-mode backgrounds use `#131413` instead of the original `#09090b`, which felt too black. Dark surfaces step up from it (`#1a1b1a`, `#232423`, borders `#2a2b2a`).
- **Photos:** the original's photos were soft and low-resolution. The rebuild uses photos supplied by the project owner, placed in `web/public/images/` and registered as named slots in `web/src/lib/photos.ts`. Until a slot has a file, a neutral placeholder renders in its place.
- **Muted text** is slightly darker in light mode (`hsl(240 4% 41%)` instead of zinc-500) so it passes WCAG AA on the grey footer and filter surfaces.
- **Text on teal is `zinc-950`**, because white on `teal-500` fails WCAG AA.
- **Other agreed improvements:** skeletons instead of the full-screen loader, the same header and footer on every page, the Airbnb-style booking card, toasts, inline form errors, pending buttons, and ₱ formatting.

## Tokens
**Colors.** The base palette is shadcn "new-york" zinc, in HSL, from `src/index.css`.

| Token | Light | Dark |
|---|---|---|
| background | `0 0% 100%` | `240 10% 3.9%` |
| foreground | `240 10% 3.9%` | `0 0% 98%` |
| primary / primary-foreground | `240 5.9% 10%` / `0 0% 98%` | `0 0% 98%` / `240 5.9% 10%` |
| secondary, muted, accent | `240 4.8% 95.9%` | `240 3.7% 15.9%` |
| muted-foreground | `240 3.8% 46.1%` | `240 5% 64.9%` |
| destructive | `0 84.2% 60.2%` | `0 62.8% 30.6%` |
| border, input | `240 5.9% 90%` | `240 3.7% 15.9%` |
| ring | `240 10% 3.9%` | `240 4.9% 83.9%` |
| radius | `0.5rem` | |

**Brand colors.** These were hardcoded in the old code and become tokens in the rebuild.

| New token | Value | Old usage |
|---|---|---|
| `--brand` | `teal-500` `#14b8a6` | primary CTAs, selected tier, search icon circle |
| `--brand-hover` | `teal-300` | hover on every outline button |
| `--brand-strong` | `teal-400` | confirm dialog action hover |
| `--brand-accent` | `#38b2ac` | loader ball, success icon |
| `--rating` | `#16baa8` | star fill |
| `--danger-icon` | `#f56565` | cancelled icon |
| `--surface-muted` | `#f4f4f5` / dark `#0e0e11` | footer, hero pill background, EXPLORE text |
| header background | `#ffffff` / dark `#09090b` | nav bars (becomes `bg-background`) |

**Shape**
- `rounded-2xl` for section cards and the hero image.
- `rounded-xl` for inner cards, result cards and images.
- `rounded-full` for all buttons, pills and chips.
- Inputs and popovers keep `rounded-md`, except the mobile search popover, which uses `rounded-[20px]`.
- Outlines are `border-[1px]` in the border token color.

## Typography
| Element | Legacy |
|---|---|
| Wordmark `TRAILVENTURE` | Alumni Sans, `text-4xl font-bold`, uppercase, links to `/` |
| Hero `EXPLORE` | Alumni Sans, `text-[100px] sm:text-[150px] font-semibold`, `#f4f4f5` (dark mode: `#09090b`) |
| Section headings (`FEATURED DESTINATIONS`, `CHOOSE US`) | DM Sans, `text-[40px] lg:text-[70px] font-extrabold leading-none`, centered, uppercase |
| Section subheading | `pt-4 pb-12 md:pb-20 font-semibold`, centered |
| Card titles | `text-xl` / `text-2xl font-semibold` |
| Body | DM Sans (optical size 9–40) |

## Button (`components/ui/button.tsx`)
- **Base:** `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4`
- **Variants:**
  - `default`: `bg-primary text-primary-foreground hover:bg-primary/90`
  - `destructive`: `bg-destructive text-destructive-foreground hover:bg-destructive/90`
  - `outline` (the most used): `border border-input bg-background hover:bg-teal-300 hover:text-[#09090b]`
  - `secondary`: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
  - `ghost`: `hover:bg-accent hover:text-accent-foreground`
  - `link`: `text-primary underline-offset-4 hover:underline`
  - Teal call to action: `bg-teal-500`. Text was `text-white` on search and `text-black` on Book Now.
- **Sizes:**
  - `default`: `h-9 px-4 py-2`
  - `sm`: `h-8 px-3 text-xs`
  - `lg`: `h-10 px-8`
  - `icon`: `h-9 w-9`

## Pages and layout
### Header (`NavBar`)
- **Container:** `sticky top-0 z-20 px-8 py-4`.
- **Grid with search:** `grid grid-cols-2 grid-rows-2 gap-2 xl:grid-cols-3 xl:grid-rows-1`. The search pill sits in the middle column on xl; below xl it takes a full-width second row.
- **Right side:** an outline button and an outline `Menu` dropdown.
  - The button shows one of three things:
    - Logged out: `Login` with a user icon.
    - Logged in: avatar plus `Welcome, {username}`.
    - On the user page: `Go to homepage`.
  - The Menu holds: avatar and username (≤640px), Dark/Light Mode, Login/Logout.
- **Home page:** the header shows no search pill until the hero scrolls out of view, then the compact pill docks into it.

### Search pill
- **Inline (Home, ≥900px):** a `rounded-full border bg-[#f4f4f5] dark:bg-[#09090b] p-2` container holding:
  - Three outline segment buttons (`px-6 pr-8 gap-4`, icon + `text-md font-bold` label + `text-xs` value):
    - **Destination** (MapPin), default value "Set Location"
    - **Date** (Calendar), "Choose your date"
    - **Price** (PhilippinePeso), "Enter your budget"
  - A teal **Find My Trailventure** button.
- **Compact (header and mobile):** an outline trigger showing a teal circle search icon and "Search TrailVenture". It opens a popover with the same segments: a `w-[330px]` column on mobile, a `rounded-full` row on desktop.
- **Segment popovers:**
  - Destination: input plus the top 3 matches.
  - Date: range calendar with past dates disabled.
  - Price: min/max sliders plus number inputs (step 500, max 100000).

### Home
1. **Hero:** `h-dvh px-8 pb-[100px]` containing the image `rounded-2xl border object-cover`, then `EXPLORE` (`relative -top-12`), then the pill (`mt-[-30px]`).
2. **Featured destinations:**
   - Wrapper `mt-[-90px] px-8`; grid `max-w-[1200px] grid-cols-2 gap-4 lg:grid-cols-4`.
   - Items 0 and 2 are `md:row-span-2`.
   - Each card shows the image `rounded-lg object-cover` and a floating label `rounded-2xl border bg-white dark:bg-[#09090b] sm:relative sm:bottom-[85px] sm:mx-4` with MapPin, name and region. Hover is `scale-105`.
3. **Choose us:** grid `md:grid-cols-3` of four cards (`rounded-2xl border p-8`, lucide icon 64px stroke 1, `text-2xl font-semibold` title) around a `row-span-2` hiking image.
   - Hassle-Free Booking (Calendar)
   - Advanced Search (Search)
   - Designed for You (User)
   - Secure and Trusted Bookings (Shield)
4. **Footer:** `py-8 mt-8 bg-[#f4f4f5] dark:bg-[#0e0e11]`, "© {year} Trailventure. All rights reserved."

### Search
- **Filter aside:** `m-8 sm:rounded-2xl sm:border sm:p-8 lg:sticky lg:top-20 lg:w-2/5`.
  - Header: "Filters" and an outline **Clear Filter** button.
  - Blocks (`rounded-2xl border p-8`): Set Date Range (inline calendar), Price Range (sliders + inputs), Destinations (popover), Review Score (Excellent +5 … Terrible +1).
  - A full-width teal **Apply Filter** button.
- **Results panel:** `lg:w-3/5`.
  - Header: "Search Results", a count pill, and Previous / Page N / Next.
  - Grid `xl:grid-cols-2`. Each card is `rounded-xl border p-4` with the image on top (`rounded-xl`) and an inner box `rounded-xl border p-4` containing the name, a truncated description, "Cheapest Package / Price per person", and a price chip.

### Package
- **Top:** title (`text-2xl font-semibold`), MapPin + address, then a carousel (`md:basis-1/2 lg:basis-1/3`, images `h-96 rounded-xl border`).
- **Left column (`lg:w-2/3`):**
  - Description card (`rounded-2xl border p-8`).
  - Package Type card:
    - Tier buttons (selected: teal).
    - Package Amenities pills (`rounded-full border p-2 px-4`, Box icon).
    - Package Type Amenities pills.
    - Select Tour Date, Quantity stepper, PHP price, **Book Now**.
  - Reviews card: **Add Comment**, "Your Comments", "Other Comments". Each review shows an avatar, username, teal stars, the comment and a date.
- **Right column (`lg:sticky lg:top-20 lg:w-1/3`):** "Package Type Itinerary". Each stop card (`rounded-xl border p-4`) shows a "Route N | Day N" chip, MapPin, location, time and description.
- **Fixed bottom pill (lg):** section nav — Overview · Description · Package Type · Reviews.
- **Rebuild change:** tier, date, guests, price breakdown and Book move into a sticky card in the right column above the itinerary. On mobile they sit behind a bottom bar that opens a Drawer.

### Booking
- **Left column (`lg:w-2/3`):**
  - Summary card: image `lg:w-64`, name, address, "Package Type" chip.
  - Package Configuration: Start date, End date, Number of person.
  - Package Rules: **Read Here** dialog.
- **Right aside:** "Invoice" with an "In PHP" chip, then Number of people, Base Price, Site Fees, Tax Fees ("Includes VAT, Tourism Tax, etc"), Total Price, and **Proceed to Checkout**.

### Booking success / cancelled
- **Success:** confetti, CircleCheck 120px `#38b2ac`, "Booking Successful!", a 2×2 detail grid, **Go to Home**.
- **Cancelled:** CircleX `#f56565` and a 2×2 grid with booking id, package, type and quantity.

### User page (becomes `/account`)
- **Banner:** `max-h-[300px] rounded-2xl object-cover`.
- **Avatar (lg):** `absolute w-[250px] rounded-2xl`.
- **Profile card:** `rounded-2xl border bg-background p-8`, overlapping upward. It holds "Customer Profile", the full name (`text-3xl font-semibold`), and a Links pill with Facebook, X and Instagram.
- **Sections:**
  - User Details: grid of label | value rows (`rounded-2xl border p-4`).
  - Your Booking: cards with image, name, tier and **See Booking Details** (dialog).
  - Your Reviews.

### Login / Register
- Centered card `max-w-[800px]`, with a photo on the left half (hidden on mobile for register) and the form on the right.
- Titles are "Login to Proceed" and "Create an Account", with a link to switch between them.

### 404
- "Error: 404 Not Found" with a **Return!** button.
