---
name: didit-kyc-frontend
description: Frontend (React/Vite) integration guide for Didit KYC in the agce-frontend monorepo. Use when wiring the profile/kyc page to the backend kyc_service, building the verification launch flow (redirect/iframe), polling session status, handling Approved/Declined/In Review/Expired states, or adapting the flow per jurisdiction (india/abudhabi/dubai/global).
---

# Didit KYC — Frontend Integration (agce-frontend)

This skill covers only the **frontend** side of the Didit flow. The backend (`kyc_service`) owns the Didit API key, webhook receipt, HMAC verification, and Mongo persistence. The frontend never talks to `verification.didit.me` directly.

For backend details (session creation API, webhook signatures, workflow IDs, standalone endpoints) see the separate `didit-kyc` skill.

---

## Where this lives in the repo

| Concern | Location |
|---|---|
| Existing KYC page shell | `apps/exchange/src/features/profile/kyc/index.tsx` |
| Route definition | `apps/exchange/src/routes/profile.routes.tsx` |
| Route constants | `apps/exchange/src/constants/routes.ts` |
| Sidebar link | `apps/exchange/src/components/layout/ProfileSidebar.tsx` |
| Instance config (jurisdiction) | `packages/config/src/*` via `useInstanceConfig()` |
| Shared types | `packages/types/src/*` |
| Auth session / token | `apps/exchange/src/features/auth/*` + store |

The current `KycPage` has three visual states wired to a local `useState<'none' | 'failed' | 'complete'>` — replace that with real status driven by the backend.

---

## The flow (frontend perspective)

```
┌──────────┐  1. POST /kyc/session     ┌──────────────┐
│ Frontend │ ────────────────────────▶ │ kyc_service  │
│ (React)  │ ◀──────────────────────── │ (our backend)│
└──────────┘  { session_id, url }      └──────┬───────┘
     │                                        │
     │ 2. redirect / iframe to url            │ creates session
     ▼                                        ▼
┌───────────────────┐                   ┌────────────┐
│ verify.didit.me   │ ◀──── workflow ── │ Didit API  │
│ (hosted session)  │                   └────────────┘
└─────────┬─────────┘
          │ user completes verification
          ▼
     redirects back to /user_profile/kyc?session_id=...
          │
          ▼
┌──────────┐  3. GET /kyc/status       ┌──────────────┐
│ Frontend │ ────────────────────────▶ │ kyc_service  │
└──────────┘ ◀──── cached status ───── └──────────────┘
     │         (driven by webhook)
     ▼
  render state: Approved | Declined | In Review | etc.
```

The webhook path (Didit → kyc_service) is invisible to the frontend — we only read the result via `GET /kyc/status`. Treat the frontend as pure consumer of backend state.

---

## Backend contract (expected API surface)

These endpoints live on `kyc_service`. Coordinate exact shapes with backend before building.

### `POST /api/v1/kyc/session`
Create (or resume) a verification session for the current user.

Request:
```ts
// Headers: Authorization: Bearer <jwt>
// Body:
{
  language?: 'en' | 'hi' | 'ar'   // optional, defaults to instance locale
  return_url?: string              // where Didit redirects user after completion
}
```

Response:
```ts
{
  session_id: string
  url: string                      // hosted Didit verification URL
  status: DiditStatus              // usually 'Not Started'
  expires_at: string               // ISO timestamp
}
```

### `GET /api/v1/kyc/status`
Read current KYC state for the logged-in user (cached by `kyc_service`, updated by webhook).

Response:
```ts
{
  status: DiditStatus
  level: 'none' | 'standard' | 'advanced'
  session_id?: string
  decision?: {
    id_verified: boolean
    liveness_passed: boolean
    face_match_passed: boolean
    aml_flagged: boolean
    decline_reason?: string
  }
  updated_at: string
}
```

### Status enum
Mirror Didit's values 1:1 so there's no translation layer:
```ts
type DiditStatus =
  | 'Not Started'
  | 'In Progress'
  | 'In Review'
  | 'Approved'
  | 'Declined'
  | 'Resubmitted'
  | 'Expired'
  | 'Abandoned'
```
Put this in `packages/types/src/kyc.ts` and re-export from the package index.

---

## Integration pattern (React)

### Step 1 — Typed API client
Add `apps/exchange/src/features/profile/kyc/api.ts`:
```ts
import type { KycStatusResponse, KycSessionResponse } from '@agce/types'
import { apiFetch } from '@/lib/api'  // or existing auth-aware fetch wrapper

export async function createKycSession(returnUrl: string): Promise<KycSessionResponse> {
  return apiFetch('/api/v1/kyc/session', {
    method: 'POST',
    body: JSON.stringify({ return_url: returnUrl }),
  })
}

export async function getKycStatus(): Promise<KycStatusResponse> {
  return apiFetch('/api/v1/kyc/status')
}
```

### Step 2 — TanStack Query hooks
Project is migrating to TanStack Query v5 (per CLAUDE.md). Place hooks in `apps/exchange/src/features/profile/kyc/hooks.ts`:
```ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { createKycSession, getKycStatus } from './api'

export function useKycStatus() {
  return useQuery({
    queryKey: ['kyc', 'status'],
    queryFn: getKycStatus,
    refetchInterval: (q) => {
      const s = q.state.data?.status
      // Poll while the user is mid-flow; stop once terminal
      return s === 'In Progress' || s === 'In Review' ? 5000 : false
    },
    staleTime: 10_000,
  })
}

export function useStartKyc() {
  return useMutation({
    mutationFn: (returnUrl: string) => createKycSession(returnUrl),
  })
}
```

Keep `queryKey: ['kyc', 'status']` stable — `auth_service` will also invalidate this key when it consumes the `kyc.status.updated` Kafka event over the app's WebSocket channel.

### Step 3 — Replace simulated state in `KycPage`
Swap the `useState<VerificationStatus>` in `features/profile/kyc/index.tsx` for `useKycStatus()`. Map Didit statuses to the existing three visual variants:

| Didit status | UI variant |
|---|---|
| `Not Started`, `Abandoned`, `Expired` | `IdentityCardInitial` (+ locked features) |
| `In Progress`, `In Review`, `Resubmitted` | new "pending" variant — spinner + "Verification in progress" |
| `Approved` | `IdentityCardComplete` |
| `Declined` | `IdentityCardFailed` (with `decision.decline_reason`) |

Don't delete the existing variants — reuse them. Add a new `IdentityCardPending` for the in-flight state rather than hacking `Failed`.

### Step 4 — Launching the hosted session
The Didit `url` is a full external URL — render the "Verify Now" button as a handler, not a `<Link>`:
```tsx
const { mutateAsync: startKyc, isPending } = useStartKyc()

async function handleVerifyClick() {
  const returnUrl = `${window.location.origin}${ROUTES.PROFILE_KYC}`
  const session = await startKyc(returnUrl)
  window.location.href = session.url  // redirect flow (default)
}
```

**Redirect vs iframe** — use redirect. Iframes break Didit's camera permission flow on Safari/iOS and on Android Chrome when cross-origin. Only consider iframe if UX explicitly demands staying on-page, and then only after testing the camera prompt on the actual target devices.

### Step 5 — Return handling
When Didit redirects the user back to `/user_profile/kyc`, the query hook will refetch and reflect current status. No special URL-param handling is required for correctness — but if `session_id` is present in the query string you can force an immediate `queryClient.invalidateQueries({ queryKey: ['kyc', 'status'] })` so the user sees the update without the 5s poll delay.

---

## Multi-instance (jurisdiction) notes

Per CLAUDE.md, the instance is baked in at build time via `VITE_INSTANCE`. KYC requirements differ per jurisdiction:

| Instance | Required docs | Notes |
|---|---|---|
| `india` | Aadhaar + PAN + VKYC | SEBI — most restrictive |
| `abudhabi` | Emirates ID + Passport | ADGM |
| `dubai` | Emirates ID + Passport | VARA |
| `global` | Passport | Offshore |

The frontend does **not** select the Didit workflow — `kyc_service` picks the right `workflow_id` based on the user's jurisdiction (from the JWT or user record). Frontend responsibilities:
- Use `useInstanceConfig()` to localize copy ("Upload your Aadhaar" vs "Upload your Emirates ID") in `IdentityCardInitial`.
- Pull required doc list from instance config, not hardcode it in the component.
- Pass `language` to `createKycSession` based on instance/user preference so the Didit hosted page matches.

Add a `kycRequirements` field to `InstanceConfig` in `packages/types` + `packages/config` rather than branching on `config.slug` inside the component.

---

## UI states reference

Keep the existing card components and add one:

1. **Initial** (`IdentityCardInitial`) — `Not Started` | `Abandoned` | `Expired`
   Copy: "It takes only 2-5 minutes to verify your account"
2. **Pending** (new — `IdentityCardPending`) — `In Progress` | `In Review` | `Resubmitted`
   Copy: "Your verification is being reviewed. This usually takes a few minutes."
   Show a spinner, disable retry. Poll every 5s.
3. **Failed** (`IdentityCardFailed`) — `Declined`
   Surface `decision.decline_reason` in the alert body if present.
   "Try Again" button re-calls `createKycSession` (backend should return the existing open session or create a new one).
4. **Complete** (`IdentityCardComplete`) — `Approved`
   Unlocks trading / deposit / withdrawal / P2P tiles.

---

## Gotchas

1. **Don't trust client status for gating.** The decision to allow deposit/withdraw/trade lives on the backend (`auth_service` caches KYC level). The frontend only renders — never guard routes based on local status without also having the backend enforce.
2. **Poll, don't WebSocket-only.** Even if a Kafka-driven WebSocket push exists, keep the TanStack Query `refetchInterval` fallback. WebSockets drop on network change and during tab-sleep.
3. **Return URL must be whitelisted.** Didit rejects unknown `return_url` values — if you change the route, coordinate with backend to update the allowlist on the session-create request.
4. **Camera permissions.** The hosted page requests camera. Don't embed in an iframe inside a permissions-policy-restricted parent — camera will silently fail.
5. **Declined is not terminal.** A declined user can retry. `Try Again` should create a fresh session; don't reuse the old `session_id`.
6. **Locale leak.** If you pass `language` but the user's browser is different, Didit may show a mismatched UI. Prefer the instance's default language unless the user explicitly picked one in settings.
7. **Don't show `session_id` in the UI.** It's a backend correlation key, not a user-facing reference. If support needs a lookup, have them use `vendor_data` (= user id) instead.
8. **Existing KycPage uses inline styles.** When wiring real state, keep the inline-style pattern consistent with the file rather than converting to Tailwind classes mid-feature — that's a separate cleanup.

---

## Implementation checklist

- [ ] Add `DiditStatus`, `KycSessionResponse`, `KycStatusResponse` to `packages/types/src/kyc.ts` and re-export
- [ ] Add `kycRequirements` to `InstanceConfig` and populate per-instance in `packages/config`
- [ ] Create `features/profile/kyc/api.ts` (typed fetch wrappers)
- [ ] Create `features/profile/kyc/hooks.ts` (`useKycStatus`, `useStartKyc`)
- [ ] Add `IdentityCardPending` variant
- [ ] Replace `useState` in `KycPage` with `useKycStatus()`
- [ ] Wire "Verify Now" / "Try Again" buttons to `useStartKyc()` → `window.location.href`
- [ ] Invalidate `['kyc', 'status']` on mount when `?session_id=` is present in the URL
- [ ] Verify the flow against a real `kyc_service` dev instance before shipping
