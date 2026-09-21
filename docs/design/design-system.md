# Design system

TrailVenture keeps the original site's look ([legacy-ui-reference.md](legacy-ui-reference.md)), with one rule the original lacked: **every text and icon size comes from a fixed scale**. Tokens live in `web/src/app/globals.css`.

## Type roles

Use the role utility, not a raw `text-*` size.

| Role | Utility | Size | Used for |
|---|---|---|---|
| Display | `.title` + explicit size | 104px / 152px | Hero `EXPLORE` only |
| Page title | `type-page-title` | 48px / 60px, Alumni Sans, uppercase | One per page (`About TrailVenture`, `My account`, package names) |
| Section title | `type-section-title` | 40px / 56px, Alumni Sans, uppercase | Home sections (`Featured Destinations`, `Choose Us`) |
| Heading | `type-heading` | 24px semibold | Auth card titles, in-page section headings |
| Card title | `type-card-title` | 20px semibold | Card and panel titles |
| Body | `type-body` | 16px, relaxed leading | Paragraphs, descriptions, primary card text |
| UI | `type-ui` | 14px | Buttons, inputs, labels, menus, metadata, footer |
| Caption | `type-caption` | 12px | Badges, photo credits, keyboard hints |

The wordmark (`Logo`) is fixed at 36px everywhere, header and footer alike.

## Icon sizes

| Size | Class | Pairs with |
|---|---|---|
| 14px | `size-3.5` | Caption text (badges, extra-small buttons) |
| **18px** | `size-4.5` | UI and body text. This is the default in every shadcn component (buttons, menus, alerts, inputs, toggles, toasts, spinners), so icons inside components take no size class |
| 24px | `size-6` | Empty-state media |
| 48px | `size-12` | Decorative feature icons (home "Choose us") |

## Buttons

- All buttons use `type-ui` text and 18px icons.
- Size variants change only height and padding: `sm` 36px, `default` 40px, `lg` 48px. Search pill segments and the "Find My Trailventure" button are 56px on desktop.
- Buttons are fully rounded. There are no drop shadows anywhere.

## States

Every data view ships loading (skeletons in the final layout), empty (`Empty` with one action) and error (`ErrorState` with retry) states. Every async button shows a spinner and is disabled while pending.
