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

type OrderBookPanelProps = {
    depth: OrderBookDepth;
    SelectedCoin: any;
    buyprice: number;
    priceChange: number;
    isPricePositive: boolean;
    loader: boolean;
    orderBookViewMode: string;
    setOrderBookViewMode: (mode: string) => void;
    orderBookAggStep: number;
    setOrderBookAggStep: (step: number) => void;
    orderBookAggOpen: boolean;
    setOrderBookAggOpen: (v: boolean | ((o: boolean) => boolean)) => void;
    orderBookSwapAmountTotal: boolean;
    setOrderBookSwapAmountTotal: (v: boolean | ((s: boolean) => boolean)) => void;
    formatPriceThousands: (raw: any) => string;
    formatQuantity: (q: any) => number;
    onAskRowClick: (data: { price: number; remaining: number }) => void;
    onBidRowClick: (data: { price: number; remaining: number }) => void;
    showTab: string;
};

export function OrderBookPanel({
    depth,
    SelectedCoin,
    buyprice,
    priceChange,
    isPricePositive,
    loader,
    orderBookViewMode,
    setOrderBookViewMode,
    orderBookAggStep,
    setOrderBookAggStep,
    orderBookAggOpen,
    setOrderBookAggOpen,
    orderBookSwapAmountTotal,
    setOrderBookSwapAmountTotal,
    formatPriceThousands,
    formatQuantity,
    onAskRowClick,
    onBidRowClick,
    showTab,
}: OrderBookPanelProps) {
    const {
        displaySellOrders,
        displayBuyOrders,
        orderBookBidAskRatio,
        formatOrderBookAggPrice,
        getAskRowMetrics,
        getBidRowMetrics,
    } = depth;

    return (
        <div id="tab_3" className={`trade_card d-lg-block summay_dasboard_pop ${showTab !== "order_book" && "d-block"}`}>
            <div className="treade_card_header d-block d-lg-flex"><div className="card_header_title active">Order Book</div></div>
            <div className=" trade_tabs buy_sell_cards  buy_sell_row d-flex-between">
                <ul className="nav custom-tabs nav_order" role="tablist">
                    <li className={`fav-tab ${orderBookViewMode === "both" ? "activepop" : ""}`}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={orderBookViewMode === "both"}
                            className={`orderbook-view-toggle ${orderBookViewMode === "both" ? "active" : ""}`}
                            onClick={() => setOrderBookViewMode("both")}
                        >
                            <img alt="" src="/images/order_1.svg" width="22" height="11" />
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
                            <img alt="" src="/images/order_2.svg" width="22" height="11" />
                        </button>
                    </li>
                    <li className={`btc-tab ${orderBookViewMode === "asks" ? "activepop" : ""}`}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={orderBookViewMode === "asks"}
                            className={`orderbook-view-toggle orderbook-view-toggle--last ${orderBookViewMode === "asks" ? "active" : ""}`}
                            onClick={() => setOrderBookViewMode("asks")}
                        >
                            <img alt="" src="/images/order_3.svg" width="22" height="11" />
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
                    {orderBookAggOpen ? (
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
                    ) : null}
                </div>
            </div>
            <div className="tab-content buy_sell_row_price">

                {orderBookViewMode === "both" && (
                    <div className="px-0">
                        <div className="price_card orderbook-card--ss">
                            <div className="table-responsive">
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

                            <div className="table-responsive">
                                <div className="price_card_body scroll_y orderbook-side-scroll">
                                    <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss">
                                        <tbody>
                                            {loader ? (
                                                <tr>
                                                    <td colSpan={3} className="text-center py-4">
                                                        <div className="spinner-border" style={{ width: '1.5rem', height: '1.5rem', borderColor: 'rgba(255, 255, 255, 0.3)', borderRightColor: 'transparent' }} />
                                                    </td>
                                                </tr>
                                            ) : displaySellOrders?.length > 0 ? (
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
                                                <tr>
                                                    <td colSpan={3} className="text-center text-muted py-4">
                                                        <p>No sell orders yet. Place the first!</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <OrderBookMidPriceRow
                                buyprice={buyprice}
                                isPricePositive={isPricePositive}
                                priceChange={priceChange}
                                formatPriceThousands={formatPriceThousands}
                            />

                            <div className="price_card_body scroll_y orderbook-side-scroll">
                                <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss">
                                    <tbody>
                                        {loader ? (
                                            <tr>
                                                <td colSpan={3} className="text-center py-4">
                                                    <div className="spinner-border" style={{ width: '1.5rem', height: '1.5rem', borderColor: 'rgba(255, 255, 255, 0.3)', borderRightColor: 'transparent' }} />
                                                </td>
                                            </tr>
                                        ) : displayBuyOrders?.length > 0 ? (
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
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted py-4">
                                                    <p className="dark:text-white" style={{
                                                        color: "#ccc !important"
                                                    }}>No buy orders yet. Place the first!</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <OrderBookBidAskFooter bidPct={orderBookBidAskRatio.bidPct} askPct={orderBookBidAskRatio.askPct} />
                        </div>
                    </div>
                )}

                {orderBookViewMode === "bids" && (
                    <div className="px-0">
                        <div className="price_card orderbook-card--ss orderbook-bids-only">
                            <div className="table-responsive">
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
                            <div className="price_card_body scroll_y center_cntr orderbook-single-side orderbook-bids-scroll">
                                <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss">
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
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted py-4">No buy orders yet. Place the first!</td>
                                            </tr>
                                        )}
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
                                accent="bid"
                            />
                            <OrderBookBidAskFooter bidPct={orderBookBidAskRatio.bidPct} askPct={orderBookBidAskRatio.askPct} />
                        </div>
                    </div>
                )}

                {orderBookViewMode === "asks" && (
                    <div className="px-0">
                        <div className="price_card orderbook-card--ss orderbook-asks-only">
                            <div className="table-responsive">
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
                            <div className="price_card_body scroll_y center_cntr orderbook-single-side orderbook-asks-scroll">
                                <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss">
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
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted py-4">No sell orders yet. Place the first!</td>
                                            </tr>
                                        )}
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
    );
}
