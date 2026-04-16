// Safe decimal math for prices / quantities / balances.
// The matching engine uses exact decimals end-to-end; the UI must not lose
// precision in float conversions before sending values back for order placement.
// Use these helpers anywhere that money math happens.

import { Decimal } from "decimal.js";

// 40 significant digits is overkill for any crypto pair; sane default for mul/div.
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

type Num = string | number | null | undefined;

const D = (v: Num) => new Decimal((v ?? 0) as string | number);

export function dAdd(a: Num, b: Num): string {
    return D(a).plus(D(b)).toString();
}

export function dSub(a: Num, b: Num): string {
    return D(a).minus(D(b)).toString();
}

export function dMul(a: Num, b: Num): string {
    return D(a).times(D(b)).toString();
}

/** Returns "0" when divisor is zero. */
export function dDiv(a: Num, b: Num): string {
    const den = D(b);
    if (den.isZero()) return "0";
    return D(a).div(den).toString();
}

/** (val * pct) / 100 */
export function dPct(val: Num, pct: Num): string {
    return D(val).times(D(pct)).div(100).toString();
}

/** Floor to nearest step multiple. For quantity inputs (no overspending). */
export function dFloorToStep(val: Num, step: Num): string {
    const s = D(step);
    if (s.isZero()) return D(val).toString();
    return D(val).div(s).floor().times(s).toString();
}

/** Round to nearest step multiple. For price inputs (snap to tick). */
export function dRoundToStep(val: Num, step: Num): string {
    const s = D(step);
    if (s.isZero()) return D(val).toString();
    return D(val).div(s).round().times(s).toString();
}

/** True iff val is an exact multiple of step. Used for server-parity validation. */
export function dIsMultipleOf(val: Num, step: Num): boolean {
    const s = D(step);
    if (s.isZero()) return true;
    return D(val).mod(s).isZero();
}

/** Fixed-decimal string, useful for display-ready formatting. */
export function dToFixed(val: Num, places: number): string {
    return D(val).toFixed(places);
}

/** Convert to a plain JS number. Only use for UI calcs where precision loss is OK. */
export function dToNumber(val: Num): number {
    return D(val).toNumber();
}

/** True iff val > 0. */
export function dGtZero(val: Num): boolean {
    return D(val).gt(0);
}

/** Compare: returns -1 / 0 / 1. */
export function dCmp(a: Num, b: Num): -1 | 0 | 1 {
    return D(a).cmp(D(b)) as -1 | 0 | 1;
}
