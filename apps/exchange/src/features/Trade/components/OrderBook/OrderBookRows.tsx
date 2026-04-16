/** Binance-style order book header: Price | Amount | Total + swap (columns can swap). */
export function OrderBookHeaderRow({ quoteCurrency, baseCurrency, swap, onSwap }: { quoteCurrency?: string; baseCurrency?: string; swap: boolean; onSwap: () => void }) {
    const q = quoteCurrency || "USDT";
    const b = baseCurrency || "BTC";
    return (
        <tr>
            <th className="orderbook-th-sticky orderbook-th-price">Price ({q})</th>
            {!swap ? (
                <>
                    <th className="orderbook-th-sticky text-center orderbook-th-amount">Amount ({b})</th>
                    <th className="orderbook-th-sticky text-end orderbook-th-total">
                        <span className="orderbook-th-total-inner">
                            <span>Total ({q})</span>
                            <button type="button" className="orderbook-col-swap-btn" onClick={onSwap} aria-label="Swap amount and total">
                                <i className="ri-arrow-left-right-line" aria-hidden />
                            </button>
                        </span>
                    </th>
                </>
            ) : (
                <>
                    <th className="orderbook-th-sticky text-end orderbook-th-total">
                        <span className="orderbook-th-total-inner">
                            <span>Total ({q})</span>
                            <button type="button" className="orderbook-col-swap-btn" onClick={onSwap} aria-label="Swap amount and total">
                                <i className="ri-arrow-left-right-line" aria-hidden />
                            </button>
                        </span>
                    </th>
                    <th className="orderbook-th-sticky text-center orderbook-th-amount">Amount ({b})</th>
                </>
            )}
        </tr>
    );
}

export function OrderBookBidRow({ data, fill, rowTotal, swap, onRowClick, formatOrderBookAggPrice, formatQuantity, formatOrderBookNotionalShort }: { data: { price: number; remaining: number }; fill: number; rowTotal: number; swap: boolean; onRowClick: () => void; formatOrderBookAggPrice: (p: number) => string; formatQuantity: (q: number) => string | number; formatOrderBookNotionalShort: (n: unknown) => string }) {
    const price = formatOrderBookAggPrice(data.price);
    const amt = formatQuantity(data.remaining);
    const depth = (
        <>
            <span className="orderbook-depth-fill orderbook-depth-fill--bid" style={{ width: `${fill}%` }} />
            <span className="orderbook-depth-text">{formatOrderBookNotionalShort(rowTotal)}</span>
        </>
    );
    const amountCell = <td className="text-center orderbook-col-num">{amt}</td>;
    const totalCell = <td className="text-end orderbook-depth-cell orderbook-depth-cell--bid">{depth}</td>;
    return (
        <tr style={{ cursor: "pointer" }} onClick={onRowClick}>
            <td className="orderbook-col-price orderbook-col-price--bid">{price}</td>
            {!swap ? (
                <>
                    {amountCell}
                    {totalCell}
                </>
            ) : (
                <>
                    {totalCell}
                    {amountCell}
                </>
            )}
        </tr>
    );
}

export function OrderBookAskRow({ data, fill, rowTotal, swap, onRowClick, formatOrderBookAggPrice, formatQuantity, formatOrderBookNotionalShort }: { data: { price: number; remaining: number }; fill: number; rowTotal: number; swap: boolean; onRowClick: () => void; formatOrderBookAggPrice: (p: number) => string; formatQuantity: (q: number) => string | number; formatOrderBookNotionalShort: (n: unknown) => string }) {
    const price = formatOrderBookAggPrice(data.price);
    const amt = formatQuantity(data.remaining);
    const depth = (
        <>
            <span className="orderbook-depth-fill orderbook-depth-fill--ask" style={{ width: `${fill}%` }} />
            <span className="orderbook-depth-text">{formatOrderBookNotionalShort(rowTotal)}</span>
        </>
    );
    const amountCell = <td className="text-center orderbook-col-num">{amt}</td>;
    const totalCell = <td className="text-end orderbook-depth-cell orderbook-depth-cell--ask">{depth}</td>;
    return (
        <tr style={{ cursor: "pointer" }} onClick={onRowClick}>
            <td className="orderbook-col-price orderbook-col-price--ask">{price}</td>
            {!swap ? (
                <>
                    {amountCell}
                    {totalCell}
                </>
            ) : (
                <>
                    {totalCell}
                    {amountCell}
                </>
            )}
        </tr>
    );
}

/** accent: "market" = green/red from last move; "bid"/"ask" = buy/sell tab colors (Binance-style) */
export function OrderBookMidPriceRow({
    buyprice,
    isPricePositive,
    priceChange,
    formatPriceThousands,
    showChangePct = true,
    afterList = false,
    accent = "market",
}: {
    buyprice: number | string;
    isPricePositive: boolean;
    priceChange: number | string;
    formatPriceThousands: (v: number | string) => string;
    showChangePct?: boolean;
    afterList?: boolean;
    accent?: string;
}) {
    const useGreenAccent = accent === "bid" ? true : accent === "ask" ? false : isPricePositive;
    return (
        <div
            className={`mrkt_trde_tab justify-content-between orderbook-mid-price orderbook-mid-price--ss ${afterList ? "orderbook-mid-price--after-list" : ""}`}
        >
            <div className="d-flex align-items-center gap-2 flex-wrap db_bl">
                <b className={useGreenAccent ? "text-green orderbook-mid-main" : "text-danger orderbook-mid-main"}>{formatPriceThousands(buyprice)}</b>
                <i className={`ri-arrow-${isPricePositive ? "up" : "down"}-line orderbook-mid-arrow ${useGreenAccent ? "text-green" : "text-danger"}`} />
                <span className="text-muted orderbook-mid-usd">${formatPriceThousands(buyprice)}</span>
                {showChangePct ? <span className="text-muted small orderbook-mid-pct">{Number(priceChange ?? 0).toFixed(2)}%</span> : null}
            </div>
            <div className="arrowright_icon">
                <i className="ri-arrow-right-s-line" />
            </div>
        </div>
    );
}

export function OrderBookBidAskFooter({ bidPct, askPct }: { bidPct: number; askPct: number }) {
    return (
        <div className="orderbook_bid_ask_footer">
            <div className="orderbook_bid_ask_labels">
                <span className="text-green">B {bidPct.toFixed(2)}%</span>
                <span className="text-danger">{askPct.toFixed(2)}% S</span>
            </div>
            <div className="orderbook_bid_ask_bar" aria-hidden>
                <span style={{ flex: bidPct }} className="orderbook_bid_ask_seg orderbook_bid_ask_seg--bid" />
                <span style={{ flex: askPct }} className="orderbook_bid_ask_seg orderbook_bid_ask_seg--ask" />
            </div>
        </div>
    );
}
