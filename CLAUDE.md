# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Root — runs across all workspaces via Turborepo
pnpm dev                   # Start landing dev server
pnpm build                 # Build all apps (turbo)
pnpm lint                  # Lint all packages (turbo)
pnpm typecheck             # Type-check all packages (turbo)

# Per-app dev
pnpm --filter @agce/landing dev
pnpm --filter @agce/exchange dev

# Per-instance landing builds (outputs to apps/landing/dist/<instance>/)
pnpm build:india
pnpm build:abudhabi
pnpm build:dubai
pnpm build:global
pnpm build:all-landing     # Builds all 4 instances sequentially
```

## Monorepo structure

```
apps/
  landing/    @agce/landing  — public marketing site (Vite + React + Tailwind)
  exchange/   @agce/exchange — trading platform (Phase 2, Vite + React)
packages/
  types/      @agce/types    — shared TypeScript interfaces (no runtime code)
  config/     @agce/config   — per-instance configs and feature flags
  ui/         @agce/ui       — shared React component library (Tailwind CSS v4)
  hooks/      @agce/hooks    — shared React hooks (useInstanceConfig, useFeatureFlag, useWebSocket)
```

## Multi-instance system

The `VITE_INSTANCE` env var (set at build time) selects which of the 4 exchange instances to build for:
- `india` — FIU-IND, INR fiat, no derivatives
- `abudhabi` — CMA regulated, AED, full products
- `dubai` — VARA licensed, AED, full products + launchpad
- `global` — best-practice baseline, USDT/USDC, full products

**How it flows:**
1. `VITE_INSTANCE=india` → `useInstanceConfig()` returns `indiaConfig` from `@agce/config`
2. Components use `useFeatureFlag('perpetuals')` → `false` for India, `true` for Dubai
3. `<FeatureGate flag="perpetuals">` renders its children only when the flag is `true`
4. `config.theme.primaryColor` is applied to CSS variables in `App.tsx` on mount

Each instance config lives in `packages/config/src/instances/<id>.ts` and is typed by `InstanceConfig` from `@agce/types`.

## Package resolution

All `@agce/*` packages are resolved to TypeScript source via Vite aliases in `vite.config.ts` — no separate build step for packages. Each app's `tsconfig.app.json` uses `paths` for TypeScript to match.

## Stack

| Concern | Choice |
|---|---|
| Build orchestration | Turborepo |
| Package manager | pnpm workspaces |
| Bundler | Vite 8 |
| UI framework | React 19 |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| Routing (landing) | React Router v7 |
| Icons | Lucide React |
| Animations | Motion |
| Exchange routing (Phase 2) | TanStack Router |
| Exchange state (Phase 2) | Zustand + TanStack Query v5 |

## Project requirements

Full platform requirements are documented in `docs/AGCE_Requirements_Specification_v1.pdf`.
The platform is a multi-jurisdiction crypto exchange (India, Abu Dhabi, Dubai, Global) built by Arab Global Virtual Assets Services LLC SPC.
