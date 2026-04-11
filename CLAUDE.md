# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                    # Start exchange app dev server

# Building
pnpm build                  # Build all apps via Turborepo
pnpm build:india            # Build landing for India instance
pnpm build:abudhabi         # Build landing for Abu Dhabi instance
pnpm build:dubai            # Build landing for Dubai instance
pnpm build:global           # Build landing for global instance
pnpm build:all-landing      # Build all 4 landing instances sequentially

# Quality
pnpm lint                   # ESLint across all packages
pnpm typecheck              # TypeScript check across all packages
```

For a single app: `cd apps/exchange && pnpm dev` or `pnpm --filter @agce/exchange dev`.

## Architecture

**Turborepo + pnpm workspaces monorepo** with two layers:

### Apps (`apps/`)
- `@agce/exchange` — Trading platform (Phase 2, under active development)

### Packages (`packages/`)
All packages are consumed as TypeScript source via Vite aliases — no separate compile step.
- `@agce/types` — TypeScript interfaces (`InstanceConfig`, `FeatureFlags`, etc.)
- `@agce/config` — Per-instance config objects (`india`, `abudhabi`, `dubai`, `global`)
- `@agce/hooks` — Shared React hooks (`useInstanceConfig`, `useFeatureFlag`, `useWebSocket`)
- `@agce/ui` — Shared component library (`Button`, `ButtonLink`, `Badge`)

### Package Imports
Packages are resolved via aliases defined in both `vite.config.ts` and `tsconfig.app.json`:
```typescript
import { useInstanceConfig } from '@agce/hooks'
import { Button } from '@agce/ui'
```
Each alias maps `@agce/pkg` → `../../packages/pkg/src/index.ts`.

## Multi-Instance System

The platform supports 4 compliance jurisdictions, each with distinct fiat currency, regulator, and feature flags:

| Instance | Jurisdiction |
|----------|-------------|
| `india`  | SEBI-regulated, INR, no derivatives/margin |
| `abudhabi` | ADGM, USD, full feature set |
| `dubai` | VARA, AED, full feature set |
| `global` | Offshore, USD, full feature set |

**Instance is selected at build time**, not runtime, via the `VITE_INSTANCE` env var:
```bash
VITE_INSTANCE=india pnpm build   # outputs to dist/india/
```
You cannot switch instances in the browser. This is intentional for regulatory compliance.

## Styling

Tailwind CSS v4 + CSS custom properties. Design tokens are defined in `apps/exchange/src/styles/index.css`. `App.tsx` overrides `--color-primary` and `--color-primary-hover` on mount based on the current instance config, so the UI automatically adapts per jurisdiction (e.g., gold theme defaults).

## Tech Stack

| Concern | Choice |
|---------|--------|
| Build orchestration | Turborepo |
| Bundler | Vite |
| UI framework | React 19 |
| Styling | Tailwind CSS v4 |
| Routing | TanStack Router (planned, not yet implemented) |
| State / server state | Zustand + TanStack Query v5 (planned) |
| TypeScript | Strict mode, v6 |

## TypeScript Notes

- Full strict mode enabled
- `noUnusedLocals` and `noUnusedParameters` are enforced — remove unused imports/variables
- ES module convention: use `.js` extensions in import paths even for `.ts` source files
