# Market Maker Program - Requirements Fulfillment Review

**Date:** 2026-04-18  
**Current Status:** ~40% Complete (Backend Foundation Built, Core Features Missing)

---

## Requirement Checklist

### ✅ 1. Formal Market Maker Application & Onboarding Process

| Item | Status | Details |
|------|--------|---------|
| MM firm registration endpoint | ✅ DONE | `POST /api/v1/mm/admin/firms` — creates MMFirm with PENDING status |
| Firm approval workflow | ✅ DONE | `PATCH /api/v1/mm/admin/firms/:id/status` — transitions PENDING → APPROVED |
| Firm status lifecycle | ✅ DONE | States: PENDING, APPROVED, SUSPENDED, TERMINATED |
| Legal agreement version tracking | 🟡 PARTIAL | `agreementVersion` field exists on MMFirm but no agreement document management |
| Contact info capture | ✅ DONE | `legalName`, `contactEmail`, `jurisdiction` stored |

**Gap:** No full-featured agreement module (no document versioning, acceptance timestamps, digital signatures).

---

### 🟡 2. Market Maker Obligations (Depth, Spread, Uptime)

| Item | Status | Details |
|------|--------|---------|
| Store min quoted depth | ✅ DONE | `obligations.minQuotedDepth` on MMAccount |
| Store max spread | ✅ DONE | `obligations.maxSpreadBps` on MMAccount (e.g., 10 = 0.10%) |
| Store target uptime % | ✅ DONE | `obligations.targetUptimeBps` on MMAccount (e.g., 9500 = 95%) |
| **ENFORCE obligations in real-time** | ❌ NOT DONE | *Comment in code: "stored but not enforced yet — Phase 2 adds the real-time monitoring cron"* |
| Monitor quoted depth | ❌ NOT DONE | No cron job or service checking actual order book depth |
| Monitor bid-ask spread | ❌ NOT DONE | No spread calculation or monitoring |
| Monitor uptime % | ❌ NOT DONE | No heartbeat or quoting activity tracking |
| Alert on SLA breach | ❌ NOT DONE | No breach detection or notification |

**Gap:** Obligations are stored but **NOT enforced or monitored**. This is a critical feature — MMs can't be held accountable without real-time SLA checking.

---

### ❌ 3. Dedicated MM API Endpoints (Reduced Latency, Higher Rate Limits)

| Item | Status | Details |
|------|--------|---------|
| **Public MM API endpoints** | ❌ NOT DONE | No dedicated routes or controllers for MM order placement |
| Latency optimization | ❌ NOT DONE | No specialized middleware or fast paths |
| Rate limit prioritization | ❌ NOT DONE | No MM-scoped rate limit rules in gateway |
| MM order placement endpoint | ❌ NOT DONE | MMs must use standard matching_service endpoints (no preferential treatment) |
| MM market data stream | ❌ NOT DONE | No dedicated WebSocket feed for MM order book updates |

**Gap:** MMs are treated as regular users. No preferential API treatment per spec §7.

---

### ✅ 4. Maker Rebate Program (Negative Maker Fees)

| Item | Status | Details |
|------|--------|---------|
| Rebate rate configuration | ✅ DONE | `makerRebateBps` on MMAccount (negative values = rebate back to MM) |
| Wire rebate to fee-service | ✅ DONE | Account creation calls `fee-service.upsertUserOverride()` with negative maker rate |
| Automatic rebate accrual | ✅ DONE | Every maker fill with negative rate auto-credits MM wallet via fee.applied event |
| Volume tier rebates | ❌ NOT DONE | No multi-tier rebate logic (e.g., 0% at $100K vol, -0.05% at $1M vol) |
| Per-symbol rebate override | ❌ NOT DONE | Rebate is global per account, not per-symbol |

**Gap:** Single flat rebate per account. No volume tiers as specified in §7.

---

### ❌ 5. Real-Time Obligation Monitoring Dashboard

| Item | Status | Details |
|------|--------|---------|
| **Dashboard UI** | ❌ NOT DONE | No frontend dashboard for MM compliance |
| MM compliance API | ❌ NOT DONE | No endpoint exposing SLA breach status, real-time metrics |
| Depth tracking | ❌ NOT DONE | No collection of depth history |
| Spread tracking | ❌ NOT DONE | No spread calculation or storage |
| Uptime tracking | ❌ NOT DONE | No heartbeat monitoring |
| Compliance alerts | ❌ NOT DONE | No notification when MM falls below SLA |

**Gap:** No monitoring infrastructure at all. This is a Phase 2 feature per the code comments.

---

### 🟡 6. Automated Rebate Calculation & Settlement

| Item | Status | Details |
|------|--------|---------|
| Consume fee.applied events | ✅ DONE | Kafka consumer in `events/consumers/fee-applied.consumer.ts` |
| Track rebates by account | ✅ DONE | MMRebate collection stores each rebate transaction |
| Daily rebate reporting | ✅ DONE | `GET /api/v1/mm/admin/accounts/:id/rebates` returns ledger |
| Automated wallet credit | ✅ DONE | Fee-service → wallet-service pipeline credits MM account automatically |
| **Daily settlement batch job** | ❌ NOT DONE | No explicit end-of-day settlement confirmation or batch processing |
| Settlement reports (daily) | 🟡 PARTIAL | Admin can query `GET /api/v1/mm/admin/rebates/summary?sinceDays=1` but no automated email/report |

**Gap:** Settlement is implicit (happens as rebates accrue). No explicit daily batch or confirmation mechanism.

---

### ✅ 7. Multiple MM Accounts Per Firm (Segregated by Instrument/Strategy)

| Item | Status | Details |
|------|--------|---------|
| Multiple accounts per firm | ✅ DONE | MMAccount has `firmId` + `userId` + `symbol` |
| Account isolation | ✅ DONE | Each account is a distinct trading identity with separate userId |
| Strategy labeling | ✅ DONE | `label` field (e.g., "BTC-USDT-main", "ETH-USDT-scalping") |
| Per-symbol obligations | ✅ DONE | Each account can have distinct symbol + spread/depth targets |
| Unique index on userId | ✅ DONE | Only one MM account per userId per instance (prevents conflicts) |

**No gaps here.** ✅ This requirement is fully met.

---

### 🟡 8. Digital Agreement Module (Version Tracking)

| Item | Status | Details |
|------|--------|---------|
| Version field on firm | ✅ DONE | `agreementVersion` on MMFirm (e.g., "1.0", "2.1") |
| Agreement document storage | ❌ NOT DONE | No blob storage, no versioned agreement documents |
| Acceptance timestamp | ❌ NOT DONE | No `agreedAt` or signature capture |
| Signature/acceptance tracking | ❌ NOT DONE | No digital signature or e-signature flow |
| Re-acceptance on update | ❌ NOT DONE | No trigger when agreement version changes |
| Audit trail | ❌ NOT DONE | No log of who accepted what version when |

**Gap:** Only version _number_ is stored. No actual agreement management, signatures, or acceptance workflow.

---

### ❌ 9. Liquidity SLA Reporting (Daily & Weekly Metrics)

| Item | Status | Details |
|------|--------|---------|
| Daily metrics collection | ❌ NOT DONE | No cron job to snapshot depth, spread, uptime daily |
| Weekly metrics aggregation | ❌ NOT DONE | No weekly reporting |
| Depth trend analysis | ❌ NOT DONE | No historical depth tracking |
| Spread trend analysis | ❌ NOT DONE | No historical spread tracking |
| Uptime reports | ❌ NOT DONE | No uptime % reporting |
| Per-symbol reporting | ❌ NOT DONE | No metrics per symbol/pair |
| MM-facing reports | ❌ NOT DONE | No endpoint for MM to see their own liquidity metrics |

**Gap:** No metrics collection or reporting infrastructure at all.

---

## Additional Missing Pieces

### ❌ Market Maker Bot Trading Logic

| Item | Status | Details |
|------|--------|---------|
| Bot quoting engine | ❌ NOT DONE | No code to place buy/sell orders continuously |
| Price monitoring | ❌ NOT DONE | No connection to market_data_service for real-time prices |
| Order placement | ❌ NOT DONE | No bot calling matching_service order endpoint |
| Order replacement | ❌ NOT DONE | No logic to cancel + replace orders as prices move |
| Spread management | ❌ NOT DONE | No dynamic spread calculation |
| Depth management | ❌ NOT DONE | No logic to scale order size by market conditions |

**Gap:** The market_maker_service is purely administrative. There's **no actual bot that places orders**. This needs a separate bot application or service.

---

### ❌ Gateway-Level MM Prioritization

| Item | Status | Details |
|------|--------|---------|
| MM-scoped rate limits | ❌ NOT DONE | No differentiation in gateway rate limiting |
| MM latency SLA | ❌ NOT DONE | No prioritized request handling |
| MM request routing | ❌ NOT DONE | No fast path or dedicated upstream |

---

## Summary by Percentage

| Category | Completion |
|----------|------------|
| Onboarding & Management | ✅ 90% |
| Rebate Program | ✅ 80% |
| Account Segregation | ✅ 100% |
| Obligations Storage | ✅ 100% |
| Obligations **Enforcement** | ❌ 0% |
| SLA Monitoring Dashboard | ❌ 0% |
| Daily/Weekly Reporting | ❌ 0% |
| Agreement Management | ❌ 20% |
| Dedicated API Endpoints | ❌ 0% |
| Bot Trading Logic | ❌ 0% |
| **Overall** | **~40%** |

---

## What Still Needs to Be Built (Priority Order)

### Phase 2A (Critical for MVP)
1. **Bot Trading Engine** — separate service or app that:
   - Pulls real-time prices from market_data_service
   - Places orders via matching_service
   - Manages order lifecycle (cancel, replace)
   - Adjusts quotes as prices move

2. **Obligation Monitoring** — service that:
   - Checks order book depth every N seconds
   - Calculates bid-ask spread
   - Tracks quoting uptime
   - Emits breach events when SLA is violated

3. **Compliance Dashboard API** — endpoints to:
   - GET /api/v1/mm/compliance/:accountId — current SLA status
   - GET /api/v1/mm/metrics/:accountId — liquidity metrics (depth, spread, uptime)
   - GET /api/v1/mm/breaches — list of SLA breaches

4. **Daily Settlement Report** — scheduled job to:
   - Aggregate rebates from previous day
   - Generate PDF/CSV report
   - Email to MM contact
   - Store as audit record

### Phase 2B (Required Before Launch)
5. **Digital Agreement Module** — backend for:
   - Uploading versioned agreement documents
   - Capturing e-signatures / acceptance
   - Storing accepted version + timestamp per firm
   - Audit trail of all agreements

6. **Volume Tier Rebates** — logic to:
   - Track 30-day rolling volume per account
   - Auto-calculate rebate tier
   - Apply tiered rate override to fee-service

7. **Gateway Rate Limiting** — Nginx config for:
   - MM API route prioritization
   - Higher rate limits per MM API key
   - Latency SLA enforcement

---

## Recommendations

1. **Immediate:** Build the **Bot Trading Engine** — without it, MM accounts can't actually trade.
2. **Next Sprint:** Implement **Obligation Monitoring** cron + Compliance Dashboard.
3. **Parallel:** Flesh out **Digital Agreement Module** with document storage + e-signature.
4. **Before Prod:** Wire **daily settlement reports** and add **volume tier rebates**.

---

## Code Health

- ✅ Good schema design (MMFirm, MMAccount, MMRebate models are clean)
- ✅ Kafka event integration is working (fee-applied consumer)
- ✅ Fee override wiring to fee-service is solid
- ⚠️ No error handling for crossed MM accounts (should prevent via unique index — OK)
- ⚠️ No tests for rebate ledger idempotency (rely on referenceId unique index — risky)
- ❌ No monitoring/alerting for Kafka consumer failures
- ❌ No API versioning strategy for future breaking changes

