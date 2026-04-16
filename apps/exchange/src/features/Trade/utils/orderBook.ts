export function formatOrderBookNotionalShort(notional: unknown) {
    const n = Number(notional);
    if (!Number.isFinite(n)) return "0";
    const abs = Math.abs(n);
    if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
    if (abs >= 1) return n.toFixed(2);
    return n.toFixed(4);
}

export function roundPriceToAgg(price: unknown, agg: number) {
    const n = Number(price);
    if (!Number.isFinite(n) || !agg) return n;
    return Math.round(n / agg) * agg;
}

export function aggregateOrderBookRows(orders: { price: number; quantity: number; remaining: number }[] | undefined, agg: number) {
    if (!orders?.length) return [];
    const map = new Map();
    for (const o of orders) {
        const bucket = roundPriceToAgg(o.price, agg);
        const prev = map.get(bucket);
        if (prev) {
            prev.quantity = (Number(prev.quantity) || 0) + (Number(o.quantity) || 0);
            prev.remaining = (Number(prev.remaining) || 0) + (Number(o.remaining) || 0);
        } else {
            map.set(bucket, { ...o, price: bucket });
        }
    }
    return Array.from(map.values());
}
