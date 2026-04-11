# AGCE Frontend

Monorepo for the **Arab Global Crypto Exchange (AGCE)** frontend — a multi-jurisdiction crypto exchange platform serving India, Abu Dhabi, Dubai, and Global markets.

Built by Arab Global Virtual Assets Services LLC SPC.

---

## Monorepo structure

```
agce-frontend/
├── apps/
│   ├── landing/        @agce/landing   — public marketing site (live)
│   └── exchange/       @agce/exchange  — trading platform (Phase 2)
├── packages/
│   ├── types/          @agce/types     — shared TypeScript interfaces
│   ├── config/         @agce/config    — per-instance configs & feature flags
│   ├── ui/             @agce/ui        — shared React component library
│   └── hooks/          @agce/hooks     — shared React hooks
└── docs/
    ├── AGCE_Requirements_Specification_v1.pdf
    └── AGCE_Third_Party_Integrations.pdf
```

All `@agce/*` packages are resolved directly to TypeScript source via Vite aliases — no separate package build step required.

---

## Tech stack

| Concern               | Choice                              |
|-----------------------|-------------------------------------|
| Build orchestration   | Turborepo                           |
| Package manager       | pnpm workspaces                     |
| Bundler               | Vite 8                              |
| UI framework          | React 19                            |
| Styling               | Tailwind CSS v4 (CSS-first)         |
| Routing (landing)     | React Router v7                     |
| Icons                 | Lucide React                        |
| Animations            | Motion                              |
| Exchange routing      | TanStack Router (Phase 2)           |
| Exchange state        | Zustand + TanStack Query v5 (Phase 2) |

---

## Prerequisites

- **Node.js** 20+
- **pnpm** 10.33+

```bash
npm install -g pnpm
```

---

## Getting started

```bash
# Install all dependencies
pnpm install

# Start the landing dev server (defaults to global instance)
pnpm dev

# Or start a specific app
pnpm --filter @agce/landing dev
pnpm --filter @agce/exchange dev
```

---

## Commands

```bash
# Development
pnpm dev                        # Start landing dev server (global instance)

# Building
pnpm build                      # Build all apps via Turborepo
pnpm build:india                # Build landing for India (VITE_INSTANCE=india)
pnpm build:abudhabi             # Build landing for Abu Dhabi (VITE_INSTANCE=abudhabi)
pnpm build:dubai                # Build landing for Dubai (VITE_INSTANCE=dubai)
pnpm build:global               # Build landing for Global (VITE_INSTANCE=global)
pnpm build:all-landing          # Build all 4 instances sequentially

# Quality
pnpm lint                       # Lint all packages
pnpm typecheck                  # Type-check all packages
```

Each instance build outputs to `apps/landing/dist/<instance>/`.

---

## Multi-instance system

The platform is built for 4 regulated exchange instances, each with its own jurisdiction, fiat currency, feature set, KYC rules, and branding.

The active instance is selected at **build time** via the `VITE_INSTANCE` environment variable.

| Instance   | Domain                          | Fiat | Regulator     | Key restriction          |
|------------|---------------------------------|------|---------------|--------------------------|
| `india`    | in.arabglobal.exchange          | INR  | FIU-IND / SEBI | No derivatives/margin   |
| `abudhabi` | abudhabi.arabglobal.exchange    | AED  | CMA (ADGM)    | No launchpad             |
| `dubai`    | dubai.arabglobal.exchange       | AED  | VARA          | Full feature set         |
| `global`   | global.arabglobal.exchange      | USD  | Best-practice | USDT/USDC only           |

### How it flows

```
VITE_INSTANCE=india
  → useInstanceConfig()        returns indiaConfig from @agce/config
  → useFeatureFlag('perpetuals') returns false
  → <FeatureGate flag="perpetuals"> renders nothing
  → config.theme.primaryColor  applied to CSS variables in App.tsx
```

### Feature flags per instance

| Flag             | India | Abu Dhabi | Dubai | Global |
|------------------|:-----:|:---------:|:-----:|:------:|
| `spot`           | ✓     | ✓         | ✓     | ✓      |
| `margin`         |       | ✓         | ✓     | ✓      |
| `perpetuals`     |       | ✓         | ✓     | ✓      |
| `options`        |       | ✓         | ✓     | ✓      |
| `derivatives`    |       | ✓         | ✓     | ✓      |
| `staking`        | ✓     | ✓         | ✓     | ✓      |
| `p2p`            | ✓     |           |       | ✓      |
| `otc`            |       | ✓         | ✓     | ✓      |
| `copyTrading`    |       | ✓         | ✓     | ✓      |
| `tokenLaunchpad` |       |           | ✓     | ✓      |
| `inrWallet`      | ✓     |           |       |        |

---

## Package details

### `@agce/types`

Pure TypeScript interfaces — no runtime code. Defines:

- `InstanceConfig` — top-level config shape
- `FeatureFlags` — all feature flag keys
- `FiatConfig`, `KYCConfig`, `ComplianceConfig`, `GeoConfig`, `ThemeConfig`, `FeeConfig`

### `@agce/config`

Per-instance config objects implementing `InstanceConfig`. One file per instance under `src/instances/`.

### `@agce/hooks`

Shared React hooks:

| Hook                          | Purpose                                                    |
|-------------------------------|------------------------------------------------------------|
| `useInstanceConfig()`         | Returns the full `InstanceConfig` for the current build    |
| `useFeatureFlag(flag)`        | Returns `boolean` for a given feature flag                 |
| `useWebSocket(url, options)`  | Managed WebSocket with auto-reconnect (max 5 attempts)     |

### `@agce/ui`

Shared component library styled with CSS custom properties (design tokens). Components:

- `Button` — 5 variants (`primary`, `secondary`, `ghost`, `outline`, `danger`), 3 sizes, loading state
- `ButtonLink` — same API as Button but renders an `<a>` tag
- `Badge` — status/label indicators

All components consume CSS variables from the design token layer (`--color-primary`, `--color-surface-*`, etc.), so they automatically adapt to each instance's theme.

---

## Adding a new instance

1. Add a config file at `packages/config/src/instances/<id>.ts` implementing `InstanceConfig`
2. Export it from `packages/config/src/index.ts`
3. Register it in the `configs` map in `packages/hooks/src/useInstanceConfig.ts`
4. Add a build script to the root `package.json`: `"build:<id>": "cross-env VITE_INSTANCE=<id> pnpm --filter @agce/landing build"`

## Adding a new feature flag

1. Add the key to the `FeatureFlags` interface in `packages/types/src/index.ts`
2. Set the value for each instance in `packages/config/src/instances/*.ts`
3. Use in components via `useFeatureFlag('myFlag')` or `<FeatureGate flag="myFlag">`

---

## Design tokens

CSS custom properties are defined in `apps/landing/src/styles/index.css` with defaults for the global instance. App.tsx overrides `--color-primary` and `--color-accent` on mount based on the instance theme config.

```css
--color-primary       /* instance brand colour */
--color-accent        /* instance accent colour */
--color-bg            /* page background (#0a0a0f) */
--color-surface       /* card / panel background */
--color-surface-2     /* elevated surface */
--color-surface-3     /* highest surface */
--color-text          /* primary text */
--color-text-muted    /* secondary text */
--color-border        /* subtle border */
```

---

## Landing app pages

| Route         | Page               |
|---------------|--------------------|
| `/`           | Home               |
| `/features`   | Features           |
| `/fees`       | Fee schedule & VIP tiers |
| `/security`   | Security overview  |
| `/compliance` | Compliance & regulation |
| `/about`      | About AGCE         |

---

## Documentation

Full platform requirements and third-party integration specs are in `docs/`:

- `AGCE_Requirements_Specification_v1.pdf` — full product & compliance requirements
- `AGCE_Third_Party_Integrations.pdf` — KYC (Didit), Travel Rule (CryptoSwift), and other integrations
