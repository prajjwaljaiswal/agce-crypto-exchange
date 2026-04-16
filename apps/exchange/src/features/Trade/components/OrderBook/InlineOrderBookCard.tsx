import {
    OrderBookHeaderRow,
    OrderBookBidRow,
    OrderBookAskRow,
    OrderBookMidPriceRow,
    OrderBookBidAskFooter,
} from "./OrderBookRows.js";
import { ORDER_BOOK_AGG_OPTIONS } from "../../constants/uiOptions.js";
import { formatOrderBookNotionalShort } from "../../utils/orderBook.js";
import type { OrderBookDepth } from "../../hooks/useOrderBookDepth.js";

type InlineOrderBookCardProps = {
    depth: OrderBookDepth;
    SelectedCoin: any;
    orderBookActiveTab: string;
    setOrderBookActiveTab: (v: string) => void;
    orderBookViewMode: string;
    setOrderBookViewMode: (v: string) => void;
    orderBookAggStep: number;
    setOrderBookAggStep: (v: number) => void;
    orderBookAggOpen: boolean;
    setOrderBookAggOpen: (v: boolean | ((o: boolean) => boolean)) => void;
    orderBookSwapAmountTotal: boolean;
    setOrderBookSwapAmountTotal: (v: boolean | ((s: boolean) => boolean)) => void;
    loader: boolean;
    buyprice: number;
    isPricePositive: boolean;
    priceChange: number;
    RecentTrade: any[];
    showTab: string;
    formatPriceThousands: (raw: any) => string;
    formatQuantity: (q: any) => number;
    onAskRowClick: (data: { price: number; remaining: number }) => void;
    onBidRowClick: (data: { price: number; remaining: number }) => void;
};

export function InlineOrderBookCard({
    depth,
    SelectedCoin,
    orderBookActiveTab,
    setOrderBookActiveTab,
    orderBookViewMode,
    setOrderBookViewMode,
    orderBookAggStep,
    setOrderBookAggStep,
    orderBookAggOpen,
    setOrderBookAggOpen,
    orderBookSwapAmountTotal,
    setOrderBookSwapAmountTotal,
    loader,
    buyprice,
    isPricePositive,
    priceChange,
    RecentTrade,
    showTab,
    formatPriceThousands,
    formatQuantity,
    onAskRowClick,
    onBidRowClick,
}: InlineOrderBookCardProps) {
    const {
        displaySellOrders,
        displayBuyOrders,
        orderBookBidAskRatio,
        formatOrderBookAggPrice,
        getAskRowMetrics,
        getBidRowMetrics,
    } = depth;

    return (
        <div id="tab_3" className={`trade_card orderbook_two d-lg-block ${showTab !== "order_book" ? "d-none" : ""}`}>
            {/* Desktop header: Order Book / Market Trades tabs */}
            <div className="treade_card_header d-none d-lg-flex">
                <div className="menuitem">
                    <div
                        className={`card_header_title cursor-pointer ${orderBookActiveTab === "orderbook" ? "active" : ""}`}
                        onClick={() => setOrderBookActiveTab("orderbook")}
                    >
                        Order Book
                    </div>
                    <div
                        className={`card_header_title cursor-pointer ${orderBookActiveTab === "tradehistory" ? "active" : ""}`}
                        onClick={() => setOrderBookActiveTab("tradehistory")}
                    >
                        Market Trades
                    </div>
                </div>
                <div className="toggle_dotted">
                    <i className="ri-more-2-fill"></i>
                </div>
            </div>

            {/* Order Book tab */}
            {(orderBookActiveTab === "orderbook" || showTab === "order_book") && (
                <div className="orderbooktab">

                    {/* View-mode + aggregation controls */}
                    <div className="trade_tabs buy_sell_cards buy_sell_row d-flex-between">
                        <ul className="nav custom-tabs nav_order" role="tablist">
                            <li className={`fav-tab ${orderBookViewMode === "both" ? "activepop" : ""}`}>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={orderBookViewMode === "both"}
                                    className={`orderbook-view-toggle ${orderBookViewMode === "both" ? "active" : ""}`}
                                    onClick={() => setOrderBookViewMode("both")}
                                >
                                    <img src="/images/order_1.svg" alt="" width="20" height="20" />
                                </button>
                            </li>
                            <li className={`usdt-tab ${orderBookViewMode === "bids" ? "activepop" : ""}`}>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={orderBookViewMode === "bids"}
                                    className={`orderbook-view-toggle ${orderBookViewMode === "bids" ? "active" : ""}`}
                                    onClick={() => setOrderBookViewMode("bids")}
                                >
                                    <img src="/images/order_2.svg" alt="" width="20" height="20" />
                                </button>
                            </li>
                            <li className={`btc-tab ${orderBookViewMode === "asks" ? "activepop" : ""}`}>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={orderBookViewMode === "asks"}
                                    className={`orderbook-view-toggle ${orderBookViewMode === "asks" ? "active" : ""}`}
                                    onClick={() => setOrderBookViewMode("asks")}
                                >
                                    <img src="/images/order_3.svg" alt="" width="20" height="20" />
                                </button>
                            </li>
                        </ul>
                        <div className="orderbook_agg_dd">
                            <button
                                type="button"
                                className="orderbook_agg_dd_trigger"
                                aria-expanded={orderBookAggOpen}
                                aria-haspopup="listbox"
                                onClick={() => setOrderBookAggOpen((o) => !o)}
                            >
                                <span className="orderbook_agg_dd_value">{String(orderBookAggStep)}</span>
                                <span className={`orderbook_agg_dd_caret ${orderBookAggOpen ? "is-open" : ""}`} aria-hidden />
                            </button>
                            {orderBookAggOpen && (
                                <ul className="orderbook_agg_dd_menu" role="listbox" aria-label="Order book aggregation">
                                    {ORDER_BOOK_AGG_OPTIONS.map((opt) => (
                                        <li key={opt} role="none">
                                            <button
                                                type="button"
                                                role="option"
                                                className="orderbook_agg_dd_item"
                                                aria-selected={orderBookAggStep === opt}
                                                onClick={() => {
                                                    setOrderBookAggStep(opt);
                                                    setOrderBookAggOpen(false);
                                                }}
                                            >
                                                {String(opt)}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="tab-content buy_sell_row_price">

                        {/* Both sides */}
                        {orderBookViewMode === "both" && (
                            <div className="px-0">
                                <div className="price_card">
                                    <div className="price_card_body2">
                                        <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss">
                                            <thead className="orderbook-thead">
                                                <OrderBookHeaderRow
                                                    quoteCurrency={SelectedCoin?.quote_currency}
                                                    baseCurrency={SelectedCoin?.base_currency}
                                                    swap={orderBookSwapAmountTotal}
                                                    onSwap={() => setOrderBookSwapAmountTotal((s) => !s)}
                                                />
                                            </thead>
                                        </table>
                                    </div>

                                    {/* Asks */}
                                    <div className="price_card_body scroll_y orderbook-side-scroll" style={{ position: "relative", minHeight: "200px" }}>
                                        {loader ? (
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "200px" }}>
                                                <div className="spinner-border" style={{ width: "1.5rem", height: "1.5rem", borderColor: "rgba(255, 255, 255, 0.3)", borderRightColor: "transparent" }} />
                                            </div>
                                        ) : (
                                            <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss" style={{ width: "100%" }}>
                                                <tbody>
                                                    {displaySellOrders?.length > 0 ? (
                                                        displaySellOrders.map((data, index) => {
                                                            const { fill, rowTotal } = getAskRowMetrics(index);
                                                            return (
                                                                <OrderBookAskRow
                                                                    key={index}
                                                                    data={data}
                                                                    fill={fill}
                                                                    rowTotal={rowTotal}
                                                                    swap={orderBookSwapAmountTotal}
                                                                    onRowClick={() => onAskRowClick(data)}
                                                                    formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                                    formatQuantity={formatQuantity}
                                                                    formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                                />
                                                            );
                                                        })
                                                    ) : (
                                                        <tr><td colSpan={3} className="text-center text-muted py-4">No sell orders</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>

                                    <OrderBookMidPriceRow
                                        buyprice={buyprice}
                                        isPricePositive={isPricePositive}
                                        priceChange={priceChange}
                                        formatPriceThousands={formatPriceThousands}
                                    />

                                    {/* Bids */}
                                    <div className="price_card_body scroll_y orderbook-side-scroll" style={{ position: "relative", minHeight: "200px" }}>
                                        {loader ? (
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "200px" }}>
                                                <div className="spinner-border" style={{ width: "1.5rem", height: "1.5rem", borderColor: "rgba(255, 255, 255, 0.3)", borderRightColor: "transparent" }} />
                                            </div>
                                        ) : (
                                            <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss" style={{ width: "100%" }}>
                                                <tbody>
                                                    {displayBuyOrders?.length > 0 ? (
                                                        displayBuyOrders.map((data, index) => {
                                                            const { fill, rowTotal } = getBidRowMetrics(index);
                                                            return (
                                                                <OrderBookBidRow
                                                                    key={index}
                                                                    data={data}
                                                                    fill={fill}
                                                                    rowTotal={rowTotal}
                                                                    swap={orderBookSwapAmountTotal}
                                                                    onRowClick={() => onBidRowClick(data)}
                                                                    formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                                    formatQuantity={formatQuantity}
                                                                    formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                                />
                                                            );
                                                        })
                                                    ) : (
                                                        <tr><td colSpan={3} className="text-center text-muted py-4">No buy orders</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>

                                    <OrderBookBidAskFooter bidPct={orderBookBidAskRatio.bidPct} askPct={orderBookBidAskRatio.askPct} />
                                </div>
                            </div>
                        )}

                        {/* Bids only */}
                        {orderBookViewMode === "bids" && (
                            <div className="px-0">
                                <div className="price_card orderbook-card--ss orderbook-bids-only">
                                    <div className="price_card_body2">
                                        <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss">
                                            <thead className="orderbook-thead">
                                                <OrderBookHeaderRow
                                                    quoteCurrency={SelectedCoin?.quote_currency}
                                                    baseCurrency={SelectedCoin?.base_currency}
                                                    swap={orderBookSwapAmountTotal}
                                                    onSwap={() => setOrderBookSwapAmountTotal((s) => !s)}
                                                />
                                            </thead>
                                        </table>
                                    </div>
                                    <div className="price_card_body scroll_y orderbook-single-side orderbook-bids-scroll" style={{ position: "relative", display: "flex", flexDirection: "column", minHeight: 0 }}>
                                        <OrderBookMidPriceRow
                                            buyprice={buyprice}
                                            isPricePositive={isPricePositive}
                                            priceChange={priceChange}
                                            formatPriceThousands={formatPriceThousands}
                                            showChangePct={false}
                                            afterList
                                            accent="bid"
                                        />
                                        <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss" style={{ width: "100%" }}>
                                            <tbody>
                                                {displayBuyOrders?.map((data, index) => {
                                                    const { fill, rowTotal } = getBidRowMetrics(index);
                                                    return (
                                                        <OrderBookBidRow
                                                            key={index}
                                                            data={data}
                                                            fill={fill}
                                                            rowTotal={rowTotal}
                                                            swap={orderBookSwapAmountTotal}
                                                            onRowClick={() => onBidRowClick(data)}
                                                            formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                            formatQuantity={formatQuantity}
                                                            formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                        />
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="orderbook-section-dash" aria-hidden />
                                    <OrderBookBidAskFooter bidPct={orderBookBidAskRatio.bidPct} askPct={orderBookBidAskRatio.askPct} />
                                </div>
                            </div>
                        )}

                        {/* Asks only */}
                        {orderBookViewMode === "asks" && (
                            <div className="px-0">
                                <div className="price_card orderbook-card--ss orderbook-asks-only">
                                    <div className="price_card_body2">
                                        <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss">
                                            <thead className="orderbook-thead">
                                                <OrderBookHeaderRow
                                                    quoteCurrency={SelectedCoin?.quote_currency}
                                                    baseCurrency={SelectedCoin?.base_currency}
                                                    swap={orderBookSwapAmountTotal}
                                                    onSwap={() => setOrderBookSwapAmountTotal((s) => !s)}
                                                />
                                            </thead>
                                        </table>
                                    </div>
                                    <div className="price_card_body scroll_y orderbook-single-side orderbook-asks-scroll" style={{ position: "relative", display: "flex", flexDirection: "column", minHeight: 0 }}>
                                        <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss" style={{ width: "100%" }}>
                                            <tbody>
                                                {displaySellOrders?.map((data, index) => {
                                                    const { fill, rowTotal } = getAskRowMetrics(index);
                                                    return (
                                                        <OrderBookAskRow
                                                            key={index}
                                                            data={data}
                                                            fill={fill}
                                                            rowTotal={rowTotal}
                                                            swap={orderBookSwapAmountTotal}
                                                            onRowClick={() => onAskRowClick(data)}
                                                            formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                            formatQuantity={formatQuantity}
                                                            formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                        />
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="orderbook-section-dash" aria-hidden />
                                    <OrderBookMidPriceRow
                                        buyprice={buyprice}
                                        isPricePositive={isPricePositive}
                                        priceChange={priceChange}
                                        formatPriceThousands={formatPriceThousands}
                                        showChangePct={false}
                                        afterList
                                        accent="ask"
                                    />
                                    <OrderBookBidAskFooter bidPct={orderBookBidAskRatio.bidPct} askPct={orderBookBidAskRatio.askPct} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* Market Trades tab (desktop only, not shown when mobile order_book tab is active) */}
            {orderBookActiveTab === "tradehistory" && showTab !== "order_book" && (
                <div className="trade_history_tab">
                    <div className="table-responsive" style={{ position: "relative", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                        <table className="table table-sm table-borderless mb-0 orderbook-table" style={{ width: "100%" }}>
                            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bs-body-bg, #12121a)", display: "table-header-group" }}>
                                <tr>
                                    <th className="text-start" style={{ position: "sticky", top: 0, background: "var(--bs-body-bg, #12121a)" }}>
                                        Price ({SelectedCoin?.quote_currency})
                                    </th>
                                    <th className="text-end" style={{ position: "sticky", top: 0, background: "var(--bs-body-bg, #12121a)" }}>
                                        Quantity ({SelectedCoin?.base_currency})
                                    </th>
                                    <th className="text-end" style={{ position: "sticky", top: 0, background: "var(--bs-body-bg, #12121a)" }}>
                                        Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="price_card_body">
                                {RecentTrade?.length > 0 ? (
                                    RecentTrade.map((item, index) => (
                                        <tr key={index}>
                                            <td className={item?.side === "BUY" ? "text-green text-start" : "text-danger text-start"}>
                                                {parseFloat(item?.price || 0)}
                                            </td>
                                            <td className="text-end">{parseFloat(item?.quantity || 0)}</td>
                                            <td className="text-end">{item?.time || "---"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="no-data-row">
                                        <td colSpan={12}>
                                            <div className="no-data-wrapper">
                                                <div className="no_data_s">
                                                    <img src="/images/no_data_vector.svg" className="img-fluid dark_img" width="96" height="96" alt="" />
                                                    <img src="/images/no_data_vector_light.png" className="img-fluid light_img" width="96" height="96" alt="" />
                                                    <p className="mt-2 text-muted">No trades yet</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
