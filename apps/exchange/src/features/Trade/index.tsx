import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { alertErrorMessage, alertSuccessMessage } from "./CustomAlertMessage";
import TVChartContainer from "./Libraries/TVChartContainer/index.jsx";
import '../TradePage/trade_new.css'
import { ProfileContext } from "../../context/ProfileProvider.js";
import { usePlatformStatus } from "../../context/PlatformStatusProvider.js";
import { SocketContext } from "./SocketContext.js";
import { Helmet } from "react-helmet-async";

const STATIC_PAIR = {
    _id: "pair-btc-usdt",
    base_currency_id: "btc-id",
    quote_currency_id: "usdt-id",
    base_currency: "BTC",
    quote_currency: "USDT",
    base_currency_fullname: "Bitcoin",
    icon_path: "/images/icon/btc.png",
    buy_price: 71959.5,
    sell_price: 71960.0,
    change_percentage: 1.82,
    change: 1225.1,
    high: 72500.0,
    low: 71200.0,
    volume: 1523.45,
    volumeQuote: 104235000.2,
    tick_size: 0.01,
    step_size: 0.00001,
    min_notional: 5,
    min_order_qty: 0.00001,
    max_order_qty: 9000,
    maker_fee: 0.1,
    taker_fee: 0.1,
};

const STATIC_PAIRS = [
    STATIC_PAIR,
    { ...STATIC_PAIR, _id: "pair-eth-usdt", base_currency: "ETH", base_currency_fullname: "Ethereum", buy_price: 3521.75, sell_price: 3522.2, change_percentage: -0.65, change: -22.8 },
    { ...STATIC_PAIR, _id: "pair-bnb-usdt", base_currency: "BNB", base_currency_fullname: "Binance Coin", buy_price: 602.1, sell_price: 602.4, change_percentage: 0.42, change: 2.5 },
    { ...STATIC_PAIR, _id: "pair-sol-usdt", base_currency: "SOL", base_currency_fullname: "Solana", buy_price: 162.22, sell_price: 162.33, change_percentage: 3.14, change: 4.94 },
    { ...STATIC_PAIR, _id: "pair-xrp-usdt", base_currency: "XRP", base_currency_fullname: "Ripple", buy_price: 0.624, sell_price: 0.625, change_percentage: -1.2, change: -0.008 },
    { ...STATIC_PAIR, _id: "pair-ada-usdt", base_currency: "ADA", base_currency_fullname: "Cardano", buy_price: 0.445, sell_price: 0.446, change_percentage: 0.86, change: 0.004 },
    { ...STATIC_PAIR, _id: "pair-doge-usdt", base_currency: "DOGE", base_currency_fullname: "Dogecoin", buy_price: 0.153, sell_price: 0.154, change_percentage: 2.01, change: 0.003 },
    { ...STATIC_PAIR, _id: "pair-dot-usdt", base_currency: "DOT", base_currency_fullname: "Polkadot", buy_price: 8.24, sell_price: 8.26, change_percentage: -0.44, change: -0.04 },
    { ...STATIC_PAIR, _id: "pair-link-usdt", base_currency: "LINK", base_currency_fullname: "Chainlink", buy_price: 17.83, sell_price: 17.85, change_percentage: 1.1, change: 0.19 },
    { ...STATIC_PAIR, _id: "pair-matic-usdt", base_currency: "MATIC", base_currency_fullname: "Polygon", buy_price: 0.982, sell_price: 0.984, change_percentage: -0.33, change: -0.003 },
    { ...STATIC_PAIR, _id: "pair-ltc-usdt", base_currency: "LTC", base_currency_fullname: "Litecoin", buy_price: 92.18, sell_price: 92.26, change_percentage: 0.73, change: 0.67 },
    { ...STATIC_PAIR, _id: "pair-avax-usdt", base_currency: "AVAX", base_currency_fullname: "Avalanche", buy_price: 35.72, sell_price: 35.8, change_percentage: 1.55, change: 0.54 },
    { ...STATIC_PAIR, _id: "pair-trx-usdt", base_currency: "TRX", base_currency_fullname: "TRON", buy_price: 0.124, sell_price: 0.125, change_percentage: 0.92, change: 0.001 },
    { ...STATIC_PAIR, _id: "pair-uni-usdt", base_currency: "UNI", base_currency_fullname: "Uniswap", buy_price: 10.14, sell_price: 10.16, change_percentage: -0.58, change: -0.06 },
    { ...STATIC_PAIR, _id: "pair-atom-usdt", base_currency: "ATOM", base_currency_fullname: "Cosmos", buy_price: 12.87, sell_price: 12.9, change_percentage: 1.24, change: 0.16 },
    { ...STATIC_PAIR, _id: "pair-near-usdt", base_currency: "NEAR", base_currency_fullname: "NEAR Protocol", buy_price: 6.73, sell_price: 6.75, change_percentage: -0.71, change: -0.05 },
];

const STATIC_BUY_ORDERS = [
    { price: 71959.5, quantity: 12.140643, remaining: 12.140643 },
    { price: 71959.4, quantity: 2.31, remaining: 2.31 },
    { price: 71959.3, quantity: 0.88, remaining: 0.88 },
    { price: 71959.2, quantity: 4.12, remaining: 4.12 },
    { price: 71959.1, quantity: 0.45, remaining: 0.45 },
    { price: 71959.0, quantity: 1.9, remaining: 1.9 },
    { price: 71958.8, quantity: 0.33, remaining: 0.33 },
    { price: 71958.5, quantity: 3.2, remaining: 3.2 },
    { price: 71958.0, quantity: 0.62, remaining: 0.62 },
    { price: 71957.5, quantity: 1.05, remaining: 1.05 },
    { price: 71957.0, quantity: 0.71, remaining: 0.71 },
    { price: 71956.5, quantity: 2.44, remaining: 2.44 },
    { price: 71956.0, quantity: 0.29, remaining: 0.29 },
    { price: 71955.5, quantity: 1.12, remaining: 1.12 },
    { price: 71955.0, quantity: 0.5, remaining: 0.5 },
    { price: 71954.0, quantity: 3.8, remaining: 3.8 },
    { price: 71953.0, quantity: 0.17, remaining: 0.17 },
    { price: 71952.0, quantity: 0.94, remaining: 0.94 },
    { price: 71951.0, quantity: 2.6, remaining: 2.6 },
    { price: 71950.0, quantity: 1.33, remaining: 1.33 },
];

const STATIC_SELL_ORDERS = [
    { price: 71965.0, quantity: 0.63642, remaining: 0.63642 },
    { price: 71964.5, quantity: 0.22, remaining: 0.22 },
    { price: 71964.0, quantity: 1.05, remaining: 1.05 },
    { price: 71963.5, quantity: 0.41, remaining: 0.41 },
    { price: 71963.0, quantity: 2.18, remaining: 2.18 },
    { price: 71962.5, quantity: 0.09, remaining: 0.09 },
    { price: 71962.0, quantity: 0.77, remaining: 0.77 },
    { price: 71961.5, quantity: 1.44, remaining: 1.44 },
    { price: 71961.0, quantity: 0.33, remaining: 0.33 },
    { price: 71960.5, quantity: 0.58, remaining: 0.58 },
    { price: 71960.0, quantity: 3.1, remaining: 3.1 },
    { price: 71959.9, quantity: 0.12, remaining: 0.12 },
    { price: 71959.8, quantity: 0.95, remaining: 0.95 },
    { price: 71959.7, quantity: 1.66, remaining: 1.66 },
    { price: 71959.6, quantity: 0.51, remaining: 0.51 },
];

const ORDER_BOOK_AGG_OPTIONS = [0.1, 0.5, 1, 10, 100];
function formatOrderBookNotionalShort(notional: unknown) {
    const n = Number(notional);
    if (!Number.isFinite(n)) return "0";
    const abs = Math.abs(n);
    if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
    if (abs >= 1) return n.toFixed(2);
    return n.toFixed(4);
}

function roundPriceToAgg(price: unknown, agg: number) {
    const n = Number(price);
    if (!Number.isFinite(n) || !agg) return n;
    return Math.round(n / agg) * agg;
}

function aggregateOrderBookRows(orders: { price: number; quantity: number; remaining: number }[] | undefined, agg: number) {
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

/** Binance-style order book header: Price | Amount | Total + swap (columns can swap). */
function OrderBookHeaderRow({ quoteCurrency, baseCurrency, swap, onSwap }: { quoteCurrency?: string; baseCurrency?: string; swap: boolean; onSwap: () => void }) {
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

function OrderBookBidRow({ data, fill, rowTotal, swap, onRowClick, formatOrderBookAggPrice, formatQuantity, formatOrderBookNotionalShort }: { data: { price: number; remaining: number }; fill: number; rowTotal: number; swap: boolean; onRowClick: () => void; formatOrderBookAggPrice: (p: number) => string; formatQuantity: (q: number) => string | number; formatOrderBookNotionalShort: (n: unknown) => string }) {
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

function OrderBookAskRow({ data, fill, rowTotal, swap, onRowClick, formatOrderBookAggPrice, formatQuantity, formatOrderBookNotionalShort }: { data: { price: number; remaining: number }; fill: number; rowTotal: number; swap: boolean; onRowClick: () => void; formatOrderBookAggPrice: (p: number) => string; formatQuantity: (q: number) => string | number; formatOrderBookNotionalShort: (n: unknown) => string }) {
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
function OrderBookMidPriceRow({
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

function OrderBookBidAskFooter({ bidPct, askPct }: { bidPct: number; askPct: number }) {
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

const STATIC_RECENT_TRADES = [
    { side: "BUY", price: 71959.4, quantity: 0.032, time: "12:31:10" },
    { side: "SELL", price: 71959.6, quantity: 0.018, time: "12:31:07" },
    { side: "BUY", price: 71959.2, quantity: 0.141, time: "12:31:03" },
    { side: "SELL", price: 71959.7, quantity: 0.222, time: "12:31:00" },
    { side: "BUY", price: 71959.1, quantity: 0.054, time: "12:30:56" },
    { side: "SELL", price: 71959.8, quantity: 0.009, time: "12:30:51" },
    { side: "BUY", price: 71959.3, quantity: 0.087, time: "12:30:47" },
    { side: "SELL", price: 71960.0, quantity: 0.14, time: "12:30:42" },
    { side: "BUY", price: 71958.9, quantity: 0.31, time: "12:30:38" },
    { side: "SELL", price: 71960.1, quantity: 0.026, time: "12:30:33" },
    { side: "BUY", price: 71958.7, quantity: 0.19, time: "12:30:28" },
    { side: "SELL", price: 71960.2, quantity: 0.073, time: "12:30:21" },
    { side: "BUY", price: 71958.8, quantity: 0.064, time: "12:30:16" },
    { side: "SELL", price: 71960.3, quantity: 0.011, time: "12:30:10" },
    { side: "BUY", price: 71958.5, quantity: 0.233, time: "12:30:05" },
    { side: "SELL", price: 71960.4, quantity: 0.059, time: "12:29:58" },
    { side: "BUY", price: 71958.4, quantity: 0.44, time: "12:29:52" },
    { side: "SELL", price: 71960.5, quantity: 0.017, time: "12:29:47" },
    { side: "BUY", price: 71958.2, quantity: 0.128, time: "12:29:41" },
    { side: "SELL", price: 71960.6, quantity: 0.035, time: "12:29:36" },
    { side: "BUY", price: 71958.0, quantity: 0.29, time: "12:29:31" },
    { side: "SELL", price: 71960.8, quantity: 0.022, time: "12:29:24" },
];

const STATIC_OPEN_ORDERS = [
    { _id: "o1", side: "BUY", order_type: "LIMIT", price: 68150, quantity: 0.25, remaining: 0.25, filled: 0, updatedAt: "2026-04-14T10:15:00Z" },
    { _id: "o2", side: "SELL", order_type: "LIMIT", price: 69300, quantity: 0.1, remaining: 0.06, filled: 0.04, updatedAt: "2026-04-14T10:10:00Z" },
];

const STATIC_ORDER_HISTORY = [
    { _id: "h1", side: "BUY", status: "FILLED", order_type: "LIMIT", pay_currency: "USDT", ask_currency: "BTC", price: 67600, avg_execution_price: 67605, quantity: 0.35, remaining: 0, total_fee: 2.1, updatedAt: "2026-04-13T09:11:00Z", executed_prices: [{ price: 67605, quantity: 0.35, fee: 2.1 }] },
    { _id: "h2", side: "SELL", status: "FILLED", order_type: "LIMIT", pay_currency: "BTC", ask_currency: "USDT", price: 68850, avg_execution_price: 68840, quantity: 0.2, remaining: 0, total_fee: 1.8, updatedAt: "2026-04-12T14:50:00Z", executed_prices: [{ price: 68840, quantity: 0.2, fee: 1.8 }] },
];

const STATIC_SPOT_WALLETS = [
    { _id: "w-btc", short_name: "BTC", full_name: "Bitcoin", icon_path: "/images/icon/btc.png", balance: 12345676 },
    { _id: "w-eth", short_name: "ETH", full_name: "Ethereum", icon_path: "/images/icon/eth.png", balance: 8842.12 },
    { _id: "w-sol", short_name: "SOL", full_name: "Solana", icon_path: "/images/icon/sol.png", balance: 190.5 },
];

const SPOT_OPEN_ORDER_KINDS = [
    { id: "limit_market", label: "Limit / Market" },
    { id: "conditional", label: "Conditional" },
    { id: "tpsl", label: "TP/SL" },
    { id: "twap", label: "TWAP" },
    { id: "iceberg", label: "Iceberg Pro" },
    { id: "loop", label: "Loop Order" },
    { id: "trailing", label: "Trailing Stop" },
];

const Trade = () => {
    const { getStatus } = usePlatformStatus();
    const isSpotDisabled = !getStatus('spot_trading').enabled;
    const token = localStorage.getItem('token');
    const [search, setsearch] = useState('');
    const [AllData, setAllData] = useState<any>({});
    const [BuyOrders, setBuyOrders] = useState<any[]>([]);
    const [CoinPairDetails, setCoinPairDetails] = useState<any[]>([]);
    const [RecentTrade, setRecentTrade] = useState<any[]>([]);
    const [SellOrders, setSellOrders] = useState<any[]>([]);
    const [buyamount, setbuyamount] = useState(1);
    const [sellAmount, setsellAmount] = useState(1);
    const [buySlippageEnabled, setBuySlippageEnabled] = useState(false);
    const [buySlippageInput, setBuySlippageInput] = useState("");
    const [infoPlaceOrder, setinfoPlaceOrder] = useState('LIMIT');
    const [coinFilter, setcoinFilter] = useState('ALL');
    const [BuyCoinBal, setBuyCoinBal] = useState<number | undefined>();
    const [SellCoinBal, setSellCoinBal] = useState<number | undefined>();
    const [openOrders, setopenOrders] = useState<any[]>([]);
    const [orderType, setorderType] = useState('All');
    const [pastOrderType, setpastOrderType] = useState('All');
    const [pastOrders, setpastOrders] = useState<any[]>([]);
    const [pastOrder2, setpastOrder2] = useState<any[]>([]);
    const [favCoins, setfavCoins] = useState<string[]>([]);
    const [sellOrderPrice, setsellOrderPrice] = useState('');
    const [buyOrderPrice, setbuyOrderPrice] = useState('');
    const [buyStopPrice, setBuyStopPrice] = useState('');
    const [sellStopPrice, setSellStopPrice] = useState('');
    const [stopPercent, setStopPercent] = useState(0);
    const [limitBuyPercent, setLimitBuyPercent] = useState(25);
    const [limitBuyFok, setLimitBuyFok] = useState(true);
    const [limitBuyIoc, setLimitBuyIoc] = useState(false);
    const [limitSellPercent, setLimitSellPercent] = useState(25);
    const [limitSellFok, setLimitSellFok] = useState(true);
    const [limitSellIoc, setLimitSellIoc] = useState(false);
    const [marketBuyPercent, setMarketBuyPercent] = useState(25);
    const [marketSellPercent, setMarketSellPercent] = useState(25);
    const [priceChange, setpriceChange] = useState<number>(0);
    const [changesHour, setChangesHour] = useState<number>(0);
    const [priceHigh, setpriceHigh] = useState<number>(0);
    const [priceLow, setpriceLow] = useState<number>(0);
    const [volume, setvolume] = useState<number>(0);
    const [showCoinList, setShowCoinList] = useState(false);
    const [loader, setloader] = useState(true);
    const [buyprice, setbuyprice] = useState<number>(0);
    const [sellPrice, setsellPrice] = useState<number>(0);
    const [SelectedCoin, setSelectedCoin] = useState<any>();
    const [isPricePositive, setIsPricePositive] = useState(true);
    const [showTab, setShowTab] = useState("chart");
    const [showBuySellTab, setShowBuySellTab] = useState("");
    const [orderBookActiveTab, setOrderBookActiveTab] = useState("orderbook");
    const [positionOrderTab, setPositionOrderTab] = useState("positions");
    const [openOrderKindTab, setOpenOrderKindTab] = useState("limit_market");
    const [showExecutedTrades, setShowExecutedTrades] = useState<Record<string, boolean>>({});
    const [Coins, setCoins] = useState<any[]>([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
    const [showMobileFavouritesPopup, setShowMobileFavouritesPopup] = useState(false);
    const [isFavouritesOpen, setIsFavouritesOpen] = useState(false);
    const [isConditionalMenuOpen, setIsConditionalMenuOpen] = useState(false);
    const { userDetails } = useContext(ProfileContext);
    const KycStatus = userDetails?.kycVerified;
    const [orderBookAggStep, setOrderBookAggStep] = useState(0.1);
    const [orderBookAggOpen, setOrderBookAggOpen] = useState(false);
    /** both = split book, bids = buy only, asks = sell only */
    const [orderBookViewMode, setOrderBookViewMode] = useState("both");
    /** Swap Amount ↔ Total column order (Binance-style). */
    const [orderBookSwapAmountTotal, setOrderBookSwapAmountTotal] = useState(false);
    const [priceFieldFocus, setPriceFieldFocus] = useState<string | null>(null);
    const [spotWallets, setSpotWallets] = useState<any[]>([]);
    const [walletsLoading, setWalletsLoading] = useState(false);
    const navigate = useNavigate()
    const { getSocket, isConnected } = useContext(SocketContext);
    // Keep a stable ref to buyprice so the socket handler can compare without re-subscribing
    const buypriceRef = useRef(buyprice);
    useEffect(() => { buypriceRef.current = buyprice; }, [buyprice]);

    // ********* Real-time market data via Socket.IO ********** //
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !isConnected || !SelectedCoin) return undefined;

        const binanceSymbol = `${SelectedCoin.base_currency}${SelectedCoin.quote_currency}`;
        const localSymbol = `${SelectedCoin.base_currency}-${SelectedCoin.quote_currency}`;

        console.log('[Trade] Subscribing socket for', binanceSymbol, '| socket id:', socket.id);

        // Subscribe to all needed channels
        socket.emit('subscribe', { channel: 'ticker', symbol: binanceSymbol });
        socket.emit('subscribe', { channel: 'depth20', symbol: binanceSymbol });
        socket.emit('subscribe', { channel: 'trade', symbol: binanceSymbol });
        socket.emit('subscribe', { channel: 'local_trade', symbol: localSymbol });
        socket.emit('subscribe', { channel: 'local_depth', symbol: localSymbol });

        // Clear the loader now that we're subscribed (static placeholder data is shown)
        setloader(false);

        // Handle Binance data events (ticker / depth20 / trade)
        const handleData = (event: any) => {
            const p = event?.payload;
            if (!p) return;

            // Ignore stale frames from a prior subscription that arrived after
            // we switched pairs. Gateway always forwards the symbol on the event.
            const eventSymbol = String(event.symbol || '').toUpperCase();
            if (eventSymbol && eventSymbol !== binanceSymbol.toUpperCase()) return;

            if (event.channel === 'ticker') {
                const lastPrice = parseFloat(p.c || '0');
                const bestBid = parseFloat(p.b || p.c || '0');
                const bestAsk = parseFloat(p.a || p.c || '0');
                setIsPricePositive(lastPrice >= buypriceRef.current);
                setbuyprice(bestBid);
                setsellPrice(bestAsk);
                setpriceChange(parseFloat(p.P || '0'));
                setChangesHour(parseFloat(p.p || '0'));
                setpriceHigh(parseFloat(p.h || '0'));
                setpriceLow(parseFloat(p.l || '0'));
                setvolume(parseFloat(p.v || '0'));
            } else if (event.channel === 'depth20') {
                if (p.bids) {
                    setBuyOrders(
                        (p.bids as [string, string][]).map(([price, qty]) => ({
                            price: parseFloat(price),
                            quantity: parseFloat(qty),
                            remaining: parseFloat(qty),
                        }))
                    );
                }
                if (p.asks) {
                    setSellOrders(
                        (p.asks as [string, string][]).map(([price, qty]) => ({
                            price: parseFloat(price),
                            quantity: parseFloat(qty),
                            remaining: parseFloat(qty),
                        }))
                    );
                }
            } else if (event.channel === 'trade') {
                setRecentTrade((prev) => [
                    {
                        side: p.m ? 'SELL' : 'BUY',
                        price: parseFloat(p.p),
                        quantity: parseFloat(p.q),
                        time: new Date(p.T).toLocaleTimeString('en-US', { hour12: false }),
                    },
                    ...prev.slice(0, 49),
                ]);
            }
        };
        socket.on('data', handleData);

        // Handle AGCE local trades
        const localTradeEvent = `local:trade:${localSymbol}`;
        const handleLocalTrade = (event: any) => {
            setRecentTrade((prev) => [
                {
                    side: event.side,
                    price: parseFloat(event.price),
                    quantity: parseFloat(event.quantity),
                    time: new Date(event.timestamp || Date.now()).toLocaleTimeString('en-US', { hour12: false }),
                },
                ...prev.slice(0, 49),
            ]);
        };
        socket.on(localTradeEvent, handleLocalTrade);

        // Handle AGCE local depth
        const localDepthEvent = `local:depth:${localSymbol}`;
        const handleLocalDepth = (event: any) => {
            if (event.bids) {
                setBuyOrders(
                    (event.bids as [string, string][]).map(([price, qty]) => ({
                        price: parseFloat(price),
                        quantity: parseFloat(qty),
                        remaining: parseFloat(qty),
                    }))
                );
            }
            if (event.asks) {
                setSellOrders(
                    (event.asks as [string, string][]).map(([price, qty]) => ({
                        price: parseFloat(price),
                        quantity: parseFloat(qty),
                        remaining: parseFloat(qty),
                    }))
                );
            }
        };
        socket.on(localDepthEvent, handleLocalDepth);

        return () => {
            socket.emit('unsubscribe', { channel: 'ticker', symbol: binanceSymbol });
            socket.emit('unsubscribe', { channel: 'depth20', symbol: binanceSymbol });
            socket.emit('unsubscribe', { channel: 'trade', symbol: binanceSymbol });
            socket.emit('unsubscribe', { channel: 'local_trade', symbol: localSymbol });
            socket.emit('unsubscribe', { channel: 'local_depth', symbol: localSymbol });
            socket.off('data', handleData);
            socket.off(localTradeEvent, handleLocalTrade);
            socket.off(localDepthEvent, handleLocalDepth);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SelectedCoin?.base_currency, SelectedCoin?.quote_currency, isConnected]);

    useEffect(() => {
        if (!orderBookAggOpen) return undefined;
        const onDown = (e: MouseEvent) => {
            if (!(e.target as Element)?.closest?.(".orderbook_agg_dd")) {
                setOrderBookAggOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOrderBookAggOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [orderBookAggOpen]);

    useEffect(() => {
        setCoinPairDetails(STATIC_PAIRS);
        setAllData({ pairs: STATIC_PAIRS });
        setCoins([
            { short_name: "BTC", description: "Bitcoin showcase data", links: [] },
            { short_name: "ETH", description: "Ethereum showcase data", links: [] },
            { short_name: "BNB", description: "BNB showcase data", links: [] },
        ]);
        setSelectedCoin(STATIC_PAIR);
        setbuyprice(STATIC_PAIR.buy_price);
        setsellPrice(STATIC_PAIR.sell_price);
        setpriceChange(STATIC_PAIR.change_percentage);
        setChangesHour(STATIC_PAIR.change);
        setpriceHigh(STATIC_PAIR.high);
        setpriceLow(STATIC_PAIR.low);
        setvolume(STATIC_PAIR.volume);
        setBuyOrders(STATIC_BUY_ORDERS);
        setSellOrders(STATIC_SELL_ORDERS);
        setRecentTrade(STATIC_RECENT_TRADES);
        setopenOrders(STATIC_OPEN_ORDERS);
        setpastOrders(STATIC_ORDER_HISTORY);
        setpastOrder2(STATIC_ORDER_HISTORY);
        setBuyCoinBal(12500.45);
        setSellCoinBal(0.67234589);
        setfavCoins([STATIC_PAIR._id]);
        setSpotWallets(STATIC_SPOT_WALLETS);
        setloader(false);
    }, []);


    useEffect(() => {
        let filteredData = pastOrder2?.filter((item: any) => {
            return pastOrderType === item?.side || pastOrderType === 'All'
        })
        setpastOrders(filteredData ? filteredData?.reverse() : [])
    }, [pastOrderType]);


    // ********* Update Buy Sell 24HChange High Low Volume Price********** //
    useEffect(() => {
        let filteredData = AllData?.pairs?.filter((item: any) => {
            return item?.base_currency_id === SelectedCoin?.base_currency_id
        })
        if (filteredData) {
            setbuyprice(filteredData[0]?.buy_price);
            setsellPrice(filteredData[0]?.sell_price);
            setpriceChange(filteredData[0]?.change_percentage);
            setChangesHour(filteredData[0]?.change);
            setpriceHigh(filteredData[0]?.high);
            setpriceLow(filteredData[0]?.low);
            setvolume(filteredData[0]?.volume);

        }
    }, [AllData]);




    // ********* Update Buy Sell 24HChange High Low Volume Price********** //
    useEffect(() => {
        if (AllData && SelectedCoin) {
            let filteredData = AllData?.pairs?.filter((item: any) => {
                return item?.base_currency_id === SelectedCoin?.base_currency_id && item?.quote_currency_id === SelectedCoin?.quote_currency_id
            })
            if (filteredData) {
                if (filteredData[0]?.buy_price >= buyprice) {
                    setIsPricePositive(true)
                } else {
                    setIsPricePositive(false)
                }
                setbuyprice(filteredData[0]?.buy_price);
                setsellPrice(filteredData[0]?.sell_price);
                setpriceChange(filteredData[0]?.change_percentage);
                setChangesHour(filteredData[0]?.change);
                setpriceHigh(filteredData[0]?.high);
                setpriceLow(filteredData[0]?.low);
                setvolume(filteredData[0]?.volume);
            }
        }
    }, [AllData]);


    // ********* Search Coins ********** //
    useEffect(() => {
        let filteredData = AllData?.pairs?.filter((item: any) => {
            return item?.base_currency?.toLowerCase().includes(search?.toLowerCase()) || item?.quote_currency?.toLowerCase().includes(search?.toLowerCase())
        })
        setCoinPairDetails(filteredData ?? [])
    }, [search, AllData]);

    // Set default coin filter to first quote currency
    useEffect(() => {
        if (CoinPairDetails?.length > 0 && coinFilter === 'ALL') {
            const firstQuoteCurrency = CoinPairDetails[0]?.quote_currency;
            if (firstQuoteCurrency) {
                setcoinFilter(firstQuoteCurrency);
            }
        }
    }, [CoinPairDetails, coinFilter]);



    const fetchSpotWallets = async () => {
        setWalletsLoading(true);
        setSpotWallets(STATIC_SPOT_WALLETS);
        setWalletsLoading(false);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchSpotWallets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleOrderPlace = async (_infoPlaceOrder: string, buyprice: any, buyamount: any, _base_currency_id: string, _quote_currency_id: string, side: string) => {
        // Validate order before placing
        if (!validateOrder(buyprice, buyamount, side)) {
            return;
        }
        alertSuccessMessage('Showcase mode: order is not sent.');
        setbuyOrderPrice('');
        setsellOrderPrice('');
    };

    const cancelOrder = async (orderId: string) => {
        setopenOrders((prev) => prev.filter((o) => o?._id !== orderId));
        alertSuccessMessage('Order removed from showcase list.');
    };

    const handleAddFav = async (pairId: string) => {
        setfavCoins((prev) => (prev.includes(pairId) ? prev.filter((id) => id !== pairId) : [...prev, pairId]));
    };


    // Reset orderbook when switching pairs
    const resetOrderbook = () => {
        setSellOrders([]);
        setBuyOrders([]);
        setRecentTrade([]);
        setOrderBookViewMode("both");
        setOrderBookSwapAmountTotal(false);
    };

    const handleSelectCoin = (data: any) => {
        // Skip if selecting the same pair - don't reset or re-subscribe
        if (SelectedCoin?.base_currency_id === data?.base_currency_id &&
            SelectedCoin?.quote_currency_id === data?.quote_currency_id) {
            setShowCoinList(false);
            return;
        }

        resetOrderbook();
        setinfoPlaceOrder("LIMIT");
        navigate(`/trade/${data?.base_currency}_${data?.quote_currency}`);
        setsellOrderPrice('');
        setbuyOrderPrice('');
        setSelectedCoin(data);
        setbuyprice(data?.buy_price);
        setsellPrice(data?.sell_price);
        setShowCoinList(false);
        setbuyamount(1);
        setsellAmount(1);
        setExpandedRowIndex(null);
        // Show static placeholder data immediately — socket subscription useEffect
        // will push live data as soon as it arrives and clear the loader.
        setBuyOrders(STATIC_BUY_ORDERS);
        setSellOrders(STATIC_SELL_ORDERS);
        setRecentTrade(STATIC_RECENT_TRADES);
        let filteredData = Coins?.filter((item) => item?.short_name === data?.base_currency)[0]
        setDesAndLinks({ ...filteredData })
    };

    const [desAndLinks, setDesAndLinks] = useState<{ description?: string; links?: any[]; [key: string]: any }>({ description: "", links: [] });
    const getDescAndLink = () => {
        if (SelectedCoin) {
            let filteredData = Coins?.filter((item) => item?.short_name === SelectedCoin?.base_currency)[0]
            setDesAndLinks({ ...filteredData })
        }
    }

    const nineDecimalFormat = (data: any) => {
        if (typeof (data) === "number") {
            // return data
            return parseFloat(data?.toFixed(9))
        } else {
            return 0
        }
    };

    // Get decimal places from tick_size or step_size
    const getDecimalPlaces = (value: any) => {
        if (!value || value >= 1) return 0;
        const str = value.toString();
        if (str.includes('e-')) {
            return parseInt(str.split('e-')[1]);
        }
        const decimalPart = str.split('.')[1];
        return decimalPart ? decimalPart.length : 0;
    };

    // Get price precision based on tick_size
    const getPricePrecision = () => {
        const tickSize = SelectedCoin?.tick_size;
        if (tickSize === undefined || tickSize === null) return 8; // default if no tick_size
        return getDecimalPlaces(tickSize);
    };

    // Get quantity precision based on step_size
    const getQuantityPrecision = () => {
        const stepSize = SelectedCoin?.step_size;
        if (stepSize === undefined || stepSize === null) return 8; // default if no step_size
        return getDecimalPlaces(stepSize);
    };

    // Format price based on tick_size precision
    const formatPrice = (price: any): string => {
        if (price === undefined || price === null || isNaN(price)) return '0';
        const precision = getPricePrecision();
        return parseFloat(Number(price).toFixed(precision)).toString();
    };

    // Format quantity based on step_size precision
    const formatQuantity = (qty: any): number => {
        if (qty === undefined || qty === null || isNaN(qty)) return 0;
        const precision = getQuantityPrecision();
        return parseFloat(Number(qty).toFixed(precision));
    };

    // Validate order before placing
    const validateOrder = (price: any, quantity: any, side: any) => {
        const tick_size = SelectedCoin?.tick_size || 0.01;
        const step_size = SelectedCoin?.step_size || 0.00001;
        const min_notional = SelectedCoin?.min_notional || 5;
        const max_order_qty = SelectedCoin?.max_order_qty || 9000;

        const numPrice = parseFloat(price);
        const numQuantity = parseFloat(quantity);
        const total = numPrice * numQuantity;

        // Validate price tick_size
        const pricePrecision = getDecimalPlaces(tick_size);
        const priceMultiplier = Math.pow(10, pricePrecision);
        if (Math.round(numPrice * priceMultiplier) % Math.round(tick_size * priceMultiplier) !== 0) {
            alertErrorMessage(`Price must be a multiple of ${tick_size}`);
            return false;
        }

        // Validate quantity step_size
        const qtyPrecision = getDecimalPlaces(step_size);
        const qtyMultiplier = Math.pow(10, qtyPrecision);
        if (Math.round(numQuantity * qtyMultiplier) % Math.round(step_size * qtyMultiplier) !== 0) {
            alertErrorMessage(`Quantity must be a multiple of ${step_size}`);
            return false;
        }

        // Validate max_order_qty
        if (numQuantity > max_order_qty) {
            alertErrorMessage(`Maximum order quantity is ${max_order_qty} ${SelectedCoin?.base_currency}`);
            return false;
        }

        // Validate min_notional (minimum order value)
        if (total < min_notional) {
            alertErrorMessage(`Minimum order value is ${min_notional} ${SelectedCoin?.quote_currency}`);
            return false;
        }

        // Validate insufficient funds
        if (side === 'BUY') {
            const availableBalance = BuyCoinBal || 0;
            if (total > availableBalance) {
                alertErrorMessage(`Insufficient funds`);
                return false;
            }
        } else if (side === 'SELL') {
            const availableBalance = SellCoinBal || 0;
            if (numQuantity > availableBalance) {
                alertErrorMessage(`Insufficient funds`);
                return false;
            }
        }

        return true;
    };

    const formatTotal = (value: any) => {
        const precision = getPricePrecision();
        const finalValue = value?.toFixed(precision)?.replace(/\.?0+$/, '');
        let formattedNum = finalValue?.toString();
        let result = formattedNum?.replace(/^0\.0*/, '');
        const decimalPart = finalValue?.toString()?.split('.')[1];
        if (!decimalPart) return finalValue;
        let zeroCount = 0;
        for (let char of decimalPart) {
            if (char === '0') {
                zeroCount++;
            } else {
                break;
            }
        }
        if (zeroCount > 4) {
            return `0.0{${zeroCount}}${result}`;
        }
        if (value < 1e-7) {
            return `0.0{${zeroCount}}${result}`;
        } else {
            return finalValue;
        }
    };

    const toFixed8 = (data: number) => {
        const precision = getQuantityPrecision();
        const multiplier = Math.pow(10, precision);
        return Math.floor(data * multiplier) / multiplier;
    };

    // Check if a value being typed could lead to a valid price >= tick_size
    const isValidPriceInput = (value: any) => {
        const valueClean = String(value).replace(/,/g, '');
        if (valueClean === '' || valueClean === '0') return true;
        const tickSize = SelectedCoin?.tick_size || 0.01;
        const pricePrecision = getPricePrecision();

        // Check decimal precision
        const regex = new RegExp(`^\\d*\\.?\\d{0,${pricePrecision}}$`);
        if (!regex.test(valueClean)) return false;

        // If it ends with a dot, allow it (user is still typing)
        if (valueClean.endsWith('.')) return true;

        const numValue = parseFloat(valueClean);
        if (isNaN(numValue)) return false;

        // If value is 0, allow (will be validated on submit)
        if (numValue === 0) return true;

        // Value must be >= tick_size
        return numValue >= tickSize;
    };

    // Check if a value being typed could lead to a valid quantity >= step_size
    const isValidQuantityInput = (value: any) => {
        if (value === '' || value === '0') return true;
        const stepSize = SelectedCoin?.step_size || 0.00001;
        const qtyPrecision = getQuantityPrecision();

        // Check decimal precision
        const regex = new RegExp(`^\\d*\\.?\\d{0,${qtyPrecision}}$`);
        if (!regex.test(value)) return false;

        // If it ends with a dot, allow it (user is still typing)
        if (value.endsWith('.')) return true;

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return false;

        // If value is 0, allow (will be validated on submit)
        if (numValue === 0) return true;

        // Value must be >= step_size
        return numValue >= stepSize;
    };

    // Handle price input - strictly block values below tick_size
    const handlePriceInput = (value: any, setter: (v: any) => void) => {
        const stripped = String(value).replace(/,/g, '');
        if (isValidPriceInput(stripped)) {
            setter(stripped);
        }
    };

    // Handle quantity input - strictly block values below step_size
    const handleQuantityInput = (value: any, setter: (v: any) => void) => {
        if (isValidQuantityInput(value)) {
            setter(value);
        }
    };

    // Round value to nearest step/tick on blur (cleanup)
    const handlePriceBlur = (value: any, setter: (v: any) => void) => {
        const v = String(value).replace(/,/g, '');
        if (v === '' || v === '0' || v === '0.') {
            setter('');
            return;
        }
        const tickSize = SelectedCoin?.tick_size || 0.01;
        const numValue = parseFloat(v);
        if (isNaN(numValue) || numValue === 0) {
            setter('');
            return;
        }
        // Ensure minimum tick_size
        if (numValue < tickSize) {
            setter(tickSize.toString());
            return;
        }
        // Round to nearest tick_size
        const rounded = Math.round(numValue / tickSize) * tickSize;
        const precision = getPricePrecision();
        setter(parseFloat(rounded.toFixed(precision)).toString());
    };

    const handleQuantityBlur = (value: any, setter: (v: any) => void) => {
        if (value === '' || value === '0' || value === '0.') {
            setter('');
            return;
        }
        const stepSize = SelectedCoin?.step_size || 0.00001;
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue === 0) {
            setter('');
            return;
        }
        // Ensure minimum step_size
        if (numValue < stepSize) {
            setter(stepSize.toString());
            return;
        }
        // Round to nearest step_size
        const rounded = Math.round(numValue / stepSize) * stepSize;
        const precision = getQuantityPrecision();
        setter(parseFloat(rounded.toFixed(precision)).toString());
    };

    const displaySellOrders = useMemo(() => {
        const rows = aggregateOrderBookRows(SellOrders, orderBookAggStep);
        return rows.sort((a, b) => b.price - a.price);
    }, [SellOrders, orderBookAggStep]);

    const displayBuyOrders = useMemo(() => {
        const rows = aggregateOrderBookRows(BuyOrders, orderBookAggStep);
        return rows.sort((a, b) => b.price - a.price);
    }, [BuyOrders, orderBookAggStep]);

    // Cumulative depth (notional) for asks: accumulate from best ask (bottom
    // row — closest to spread) upward. cumNotional[i] = running sum of
    // price*qty from the last row back to row i.
    const askDepth = useMemo(() => {
        const n = displaySellOrders.length;
        const cumNotional = new Array<number>(n).fill(0);
        const cumQty = new Array<number>(n).fill(0);
        let notionalAcc = 0;
        let qtyAcc = 0;
        for (let i = n - 1; i >= 0; i--) {
            const q = Number(displaySellOrders[i].remaining) || 0;
            const pr = Number(displaySellOrders[i].price) || 0;
            qtyAcc += q;
            notionalAcc += q * pr;
            cumQty[i] = qtyAcc;
            cumNotional[i] = notionalAcc;
        }
        return { cumQty, cumNotional, totalNotional: notionalAcc || 1 };
    }, [displaySellOrders]);

    // Cumulative depth for bids: accumulate from best bid (top row — closest
    // to spread) downward.
    const bidDepth = useMemo(() => {
        const n = displayBuyOrders.length;
        const cumNotional = new Array<number>(n).fill(0);
        const cumQty = new Array<number>(n).fill(0);
        let notionalAcc = 0;
        let qtyAcc = 0;
        for (let i = 0; i < n; i++) {
            const q = Number(displayBuyOrders[i].remaining) || 0;
            const pr = Number(displayBuyOrders[i].price) || 0;
            qtyAcc += q;
            notionalAcc += q * pr;
            cumQty[i] = qtyAcc;
            cumNotional[i] = notionalAcc;
        }
        return { cumQty, cumNotional, totalNotional: notionalAcc || 1 };
    }, [displayBuyOrders]);

    const orderBookBidAskRatio = useMemo(() => {
        const bid = displayBuyOrders.reduce((s, o) => s + (Number(o.remaining) || 0), 0);
        const ask = displaySellOrders.reduce((s, o) => s + (Number(o.remaining) || 0), 0);
        const t = bid + ask;
        if (t <= 0) return { bidPct: 50, askPct: 50 };
        return { bidPct: (bid / t) * 100, askPct: (ask / t) * 100 };
    }, [displayBuyOrders, displaySellOrders]);

    const formatOrderBookAggPrice = (price: any) => {
        if (price === undefined || price === null || Number.isNaN(Number(price))) return "0";
        const n = Number(price);
        if (orderBookAggStep >= 1) return String(Math.round(n));
        return parseFloat(n.toFixed(1)).toString();
    };

    const getAskRowMetrics = (index: number) => {
        const cum = askDepth.cumNotional[index] || 0;
        const fill = askDepth.totalNotional ? (cum / askDepth.totalNotional) * 100 : 0;
        return { fill, rowTotal: cum };
    };

    const getBidRowMetrics = (index: number) => {
        const cum = bidDepth.cumNotional[index] || 0;
        const fill = bidDepth.totalNotional ? (cum / bidDepth.totalNotional) * 100 : 0;
        return { fill, rowTotal: cum };
    };

    const formatPriceThousands = (raw: any) => {
        const n = parseFloat(String(raw).replace(/,/g, ""));
        if (Number.isNaN(n)) return raw === undefined || raw === null ? "" : String(raw);
        const prec = getPricePrecision();
        return n.toLocaleString("en-US", { maximumFractionDigits: prec, minimumFractionDigits: 0 });
    };

    const nudgeBuyOrderPrice = (direction: number) => {
        const tick = Number(SelectedCoin?.tick_size) || 0.01;
        const prec = getPricePrecision();
        const base = buyOrderPrice !== "" ? parseFloat(buyOrderPrice) : Number(buyprice) || 0;
        const n = Number.isFinite(base) ? base : 0;
        const next = Math.round((n + direction * tick) / tick) * tick;
        const clamped = Math.max(next, tick);
        const nextStr = parseFloat(clamped.toFixed(prec)).toString();
        setbuyOrderPrice(nextStr);
        if (infoPlaceOrder === "LIMIT" && BuyCoinBal) {
            const p = parseFloat(nextStr);
            if (p > 0) {
                setbuyamount(toFixed8(((BuyCoinBal / 100) * limitBuyPercent) / p));
            }
        }
    };

    const applyLimitBuySlider = (pct: number) => {
        const safe = [0, 25, 50, 75, 100].includes(pct) ? pct : 25;
        setLimitBuyPercent(safe);
        const p = buyOrderPrice !== "" ? parseFloat(buyOrderPrice) : Number(buyprice) || 0;
        if (!p || BuyCoinBal === undefined || BuyCoinBal === null) return;
        setbuyamount(toFixed8(((BuyCoinBal / 100) * safe) / p));
    };

    const applyMarketBuySlider = (pct: number) => {
        const safe = [0, 25, 50, 75, 100].includes(pct) ? pct : 25;
        setMarketBuyPercent(safe);
        const p = Number(buyprice) || 0;
        if (!p || BuyCoinBal === undefined || BuyCoinBal === null) return;
        setbuyamount(toFixed8(((BuyCoinBal / 100) * safe) / p));
    };

    const applyMarketSellSlider = (pct: number) => {
        const safe = [0, 25, 50, 75, 100].includes(pct) ? pct : 25;
        setMarketSellPercent(safe);
        if (SellCoinBal === undefined || SellCoinBal === null) return;
        setsellAmount(toFixed8((SellCoinBal / 100) * safe));
    };

    const applyLimitSellSlider = (pct: number) => {
        const safe = [0, 25, 50, 75, 100].includes(pct) ? pct : 25;
        setLimitSellPercent(safe);
        if (SellCoinBal === undefined || SellCoinBal === null) return;
        setsellAmount(toFixed8((SellCoinBal / 100) * safe));
    };

    const nudgeSellOrderPrice = (direction: number) => {
        const tick = Number(SelectedCoin?.tick_size) || 0.01;
        const prec = getPricePrecision();
        const base = sellOrderPrice !== "" ? parseFloat(sellOrderPrice) : Number(sellPrice) || 0;
        const n = Number.isFinite(base) ? base : 0;
        const next = Math.round((n + direction * tick) / tick) * tick;
        const clamped = Math.max(next, tick);
        setsellOrderPrice(parseFloat(clamped.toFixed(prec)).toString());
    };

    const isStopOrder = infoPlaceOrder === "STOP_LIMIT" || infoPlaceOrder === "STOP_MARKET";
    const isLimitBuyUi = infoPlaceOrder === "LIMIT" && !isStopOrder;
    const showSpotOrderFooter =
        infoPlaceOrder === "LIMIT" ||
        infoPlaceOrder === "MARKET" ||
        infoPlaceOrder === "STOP_LIMIT" ||
        infoPlaceOrder === "STOP_MARKET";

    return (
        <>
            <Helmet>
                <title>{`${SelectedCoin?.base_currency || "BTC"}/${SelectedCoin?.quote_currency || "USDT"} Spot Trading – AGCE`}</title>

                <meta
                    name="description"
                    content="Trade Bitcoin against USDT on AGCE with intuitive interface, live market data and safety features. Register today."
                />

                <meta
                    name="keywords"
                    content="spot bitcoin usdt, trade bitcoin exchange, AGCE spot trading, BTC USDT AGCE"
                />
            </Helmet>



            <div className="trade-wrapper spot pb-3 ">
                <div className="  container-fluid">
                    <div className="row g-1 g-md-2" >

                        <div className={`col-12 col-lg-12 col-xl-2 col-xxl-2 trade_favourites_lft ${isFavouritesOpen ? "is-open" : "is-collapsed"}`}>
                            <div className="spotLists">

                                {/* Search */}
                                <div className="spot-list-search">
                                    <div className="ivu-input">
                                        <i className="ri-search-2-line"></i>
                                        <input
                                            autoComplete="off"
                                            spellCheck="false"
                                            type="search"
                                            placeholder="Search"
                                            onChange={(e) => setsearch(e.target.value)}
                                            value={search}
                                        />
                                    </div>
                                </div>

                                <ul className="favorites_list_tabs">
                                    {token && (
                                        <li>
                                            <button
                                                className={coinFilter === 'FAV' ? 'active' : ''}
                                                onClick={() => setcoinFilter('FAV')}
                                            >
                                                Favourites
                                            </button>
                                        </li>
                                    )}
                                    {CoinPairDetails && [...new Set(CoinPairDetails.map(item => item?.quote_currency)), "BTC", "BNB", "ETH"].map((quoteCurrency, idx) => (
                                        <li key={idx}>
                                            <button
                                                className={coinFilter === quoteCurrency ? 'active' : ''}
                                                onClick={() => setcoinFilter(quoteCurrency)}
                                            >
                                                {quoteCurrency}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Table */}
                                <div className="price_card table-responsive">
                                    <table className="table table-sm table-borderless mb-0 orderbook-table">
                                        <thead>
                                            <tr>
                                                <th>Pair</th>
                                                <th className="text-end">Price</th>
                                                <th className="text-end">Change</th>
                                            </tr>
                                        </thead>

                                        <tbody className="price_card_body">

                                            {/* ALL TAB */}
                                            {CoinPairDetails &&
                                                CoinPairDetails.map((data, index) => {
                                                    // Filter by favorites
                                                    if (coinFilter === "FAV" && !favCoins.includes(data?._id)) {
                                                        return null;
                                                    }
                                                    // Filter by quote currency
                                                    if (coinFilter !== "FAV" && (data?.quote_currency !== coinFilter && data?.base_currency !== coinFilter)) {
                                                        return null;
                                                    }


                                                    const isActive =
                                                        SelectedCoin?.base_currency === data?.base_currency &&
                                                        SelectedCoin?.quote_currency === data?.quote_currency;

                                                    return (
                                                        <tr
                                                            key={index}
                                                            className={isActive ? "active" : ""}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleSelectCoin(data)}
                                                        >
                                                            {/* Pair */}
                                                            <td>
                                                                <div className="d-flex align-items-center gap-1">
                                                                    <img
                                                                        src={data?.icon_path}
                                                                        alt=""
                                                                        className="img-fluid me-1 round_img"
                                                                    />
                                                                    <div className="d-flex flex-column">
                                                                        {`${data?.base_currency}/${data?.quote_currency}`}
                                                                        <span className="tokensubcnt">{data?.base_currency_fullname}</span>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Price */}
                                                            <td className="text-end">
                                                                <div className="d-flex flex-column">
                                                                    <span>{data?.buy_price}</span>
                                                                    <span className="tokensubcnt">${data?.buy_price}</span>
                                                                </div>
                                                            </td>

                                                            {/* Change + Star */}
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end align-items-center gap-2">
                                                                    <div className="d-flex flex-column text-end">
                                                                        <span
                                                                            className={
                                                                                data?.change_percentage >= 0
                                                                                    ? "text-green"
                                                                                    : "text-danger"
                                                                            }
                                                                        >
                                                                            {data?.change_percentage >= 0 ? `+${Number(parseFloat(data?.change_percentage)?.toFixed(5))}` : Number(parseFloat(data?.change_percentage)?.toFixed(5))}%
                                                                        </span>
                                                                        <span className="tokensubcnt">{parseFloat(data?.change?.toFixed(5)) || 0}</span>
                                                                    </div>

                                                                    {token && (
                                                                        <i
                                                                            className={
                                                                                favCoins.includes(data?._id)
                                                                                    ? "ri ri-star-fill ri-xl"
                                                                                    : "ri ri-star-line ri-xl"
                                                                            }
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleAddFav(data?._id);
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-12 col-xl-7  col-xxl-7 midgraph_col">
                            {/* <div className={`bs_dropbox spotLists_bs_dropbox ${showCoinList === true ? 'active' : ""}`}>
                                <div className="spotLists active" >
                                    <div className=" trade_tabs buy_sell_cards   ">
                                        <div className="bs_box_header " >
                                            <h6>
                                                Trading Pair
                                            </h6>
                                            <span className="cursor-pointer" onClick={() => setShowCoinList(!showCoinList)}>
                                                <i className="ri-close-line"></i>
                                            </span>
                                        </div>

                                        <ul className="nav custom-tabs nav_order">
                                            <li className="all-tab">
                                                <a className="active" data-bs-toggle="tab" href="#tab_all" onClick={() => setcoinFilter('ALL')}> All </a>
                                            </li>
                                            <li className="cvt-tab">
                                                <a data-bs-toggle="tab" href="#tab_all" onClick={() => setcoinFilter('CVT')}>CVT</a>
                                            </li>
                                            <li className="usdt-tab">
                                                <a data-bs-toggle="tab" href="#tab_all" onClick={() => setcoinFilter('USDT')}>USDT</a>
                                            </li>
                                            {token &&
                                                <li className="favt-tab">
                                                    <a data-bs-toggle="tab" href="#tab_fav" onClick={() => setcoinFilter('FAV')}>FAV</a>
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                    <div className="spot-list-search">
                                        <div className="ivu-input" >
                                            <i className="ri-search-2-line"></i>
                                            <input autoComplete="off" spellCheck="false" type="search" placeholder="Search" className=""
                                                onChange={(e) => { setsearch(e.target.value) }} value={search} />
                                        </div>
                                    </div>
                                    <div className="price_card">
                                        <div className="price_card_head">
                                            <div>Pair</div>
                                            <div>Price</div>
                                            <div>24H%</div>
                                        </div>
                                        <div className="price_card_body tab-content scroll_y" style={{ cursor: "pointer" }}>
                                            <div className="tab-pane px-0" id="tab_fav" >
                                                {CoinPairDetails ? CoinPairDetails?.map((data, index) => {
                                                    return (
                                                        favCoins.includes(data?._id) && <div className={`price_item_value ${SelectedCoin?.base_currency === data?.base_currency && SelectedCoin?.quote_currency === data?.quote_currency ? 'active' : ''}`} key={index}>
                                                            <span className="d-flex align-items-center gap-1">
                                                                {token && <i className={favCoins.includes(data?._id) ? "ri ri-star-fill ri-xl" : "ri ri-star-line ri-xl"} onClick={() => { handleAddFav(data?._id) }} >
                                                                </i>}
                                                                <dt className="td_div" onClick={() => handleSelectCoin(data)}>
                                                                    <img alt="" src={data?.icon_path} className="img-fluid  me-1 round_img" />
                                                                    {`${data?.base_currency}/${data?.quote_currency}`}
                                                                </dt>
                                                            </span>
                                                            <span className="">{data?.buy_price}</span>
                                                            <span className={data?.change_percentage >= 0 ? "text-green" : "text-danger"}>
                                                                {parseFloat(data?.change_percentage?.toFixed(5))}%
                                                            </span>
                                                        </div>

                                                    )
                                                }) : null}
                                            </div>
                                            <div className="tab-pane px-0 active" id="tab_all" >
                                                {CoinPairDetails ?
                                                    CoinPairDetails?.map((data, index) => {
                                                        return (
                                                            (coinFilter === 'ALL' ||
                                                                (coinFilter === 'USDT' && (data?.quote_currency === 'USDT' || data?.base_currency === 'USDT')) ||
                                                                (coinFilter === 'CVT' && (data?.quote_currency === 'CVT' || data?.base_currency === 'CVT'))) &&

                                                            <div className={`price_item_value ${SelectedCoin?.base_currency === data?.base_currency && SelectedCoin?.quote_currency === data?.quote_currency ? 'active' : ''}`} key={index} onClick={() => handleSelectCoin(data)}>
                                                                <span className="d-flex align-items-center gap-1">
                                                                    {token && <i className={favCoins.includes(data?._id) ? "ri ri-star-fill ri-xl" : "ri ri-star-line  ri-xl"} onClick={() => { handleAddFav(data?._id) }} >
                                                                    </i>}
                                                                    <dt className="td_div" >
                                                                        <img alt="" src={data?.icon_path} className="img-fluid  me-1 round_img" />
                                                                        {`${data?.base_currency}/${data?.quote_currency}`}
                                                                    </dt>
                                                                </span>
                                                                <span className="">{data?.buy_price}</span>
                                                                <span className={data?.change_percentage >= 0 ? "text-green" : "text-danger"}>{parseFloat(data?.change_percentage?.toFixed(5))}%</span>
                                                            </div>
                                                        );
                                                    })
                                                    : null}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className="trade_card p-2  overflow_card mb-1" >
                                <div className="headline_left__lBBPY">

                                    <div className="headline_left__lBBPY_leftmain d-flex align-items-center">
                                        <div
                                            className="headline_symbolName__KfmIZ mt_tr_pr cursor-pointer"
                                            onClick={() => {
                                                // Mobile: open bottom-sheet favourites popup
                                                if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 991px)").matches) {
                                                    setShowCoinList(!showCoinList);
                                                    setShowMobileFavouritesPopup(true);
                                                    return;
                                                }
                                                // Desktop: toggle favourites dropdown
                                                setIsFavouritesOpen((v) => !v);
                                            }}
                                        >
                                            <div className="headline_bigName__dspVW "  >
                                                {/* <i className="faaa  ri-menu-add-line"></i> */}
                                                <img alt="" src={SelectedCoin?.icon_path} width="24" className="img-fluid round_img" />
                                            </div>

                                            <div>
                                                <div className="headline_bigName__dspVW ">
                                                    <h1>{SelectedCoin ? `${SelectedCoin?.base_currency}/${SelectedCoin?.quote_currency}` : "---/---"}
                                                        <i className="ri-arrow-down-s-line ms-1"></i>
                                                    </h1>
                                                </div>
                                                <div className="headline_etfDisplay__P4Hdv"><span>{SelectedCoin?.base_currency_fullname}</span></div>
                                            </div>
                                        </div>
                                        <div className="headline_leftItem__7BFYq headline_latestPrice__AYXu0 d-lg-none ms-0 mt-1">
                                            <div>
                                                <span className={`headline_title__x1csO font-weight-boldd  ${isPricePositive ? "text-green" : "text-danger"}`}  >{SelectedCoin ? parseFloat(buyprice?.toFixed(8)) : 0} </span>
                                            </div>
                                        </div>
                                        <div className="headline_leftItem__7BFYq ms-0 d-flex d-lg-none ">
                                            <div className="headline_withBorder__a6ZD2 me-1 ">24h Change</div>
                                            <div className={`headline_title__x1csO font-weight-boldd ${priceChange >= 0 ? "text-green" : "text-danger"}`}  >
                                                {priceChange >= 0 ? "+" : ""}   {Number(priceChange).toFixed(2)}%
                                                <span className="ms-1"> {Number(changesHour).toFixed(2)}</span>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="scroll-subtabs_scrollSubInfo__T5nZF headline_left__lBBPY_rightmain" >
                                        <div className="scroll-subtabs_tabs__Prom8" >
                                            <div className="scroll-subtabs_subMarketWrap__XVmHp" >
                                                <div className="headline_extendInfoWrapper__dooIS">
                                                    <div className="headline_leftItem__7BFYq  d-none d-lg-block">
                                                        <div className="headline_withBorder__a6ZD2 ">  Last Price  ({SelectedCoin?.quote_currency}) </div>

                                                        <span className={`headline_title__x1csO font-weight-boldd  ${isPricePositive ? "text-green" : "text-danger"}`}  >{SelectedCoin ? parseFloat(buyprice?.toFixed(8)) : 0} </span>

                                                    </div>
                                                    <div className="headline_leftItem__7BFYq d-none d-lg-block">
                                                        <div className="headline_withBorder__a6ZD2 ">24h Change</div>
                                                        <div className={`headline_title__x1csO font-weight-boldd ${priceChange >= 0 ? "text-green" : "text-danger"}`}  >
                                                            {priceChange >= 0 ? "+" : ""}   {Number(priceChange).toFixed(2)}%
                                                        </div>
                                                    </div>
                                                    <div className="headline_leftItem__7BFYq">
                                                        <div className="headline_withBorder__a6ZD2 ">24h High ({SelectedCoin?.quote_currency})</div>
                                                        <div className="headline_title__x1csO text-success font-weight-boldd"  >
                                                            {Number(priceHigh).toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="headline_leftItem__7BFYq">
                                                        <div className="headline_withBorder__a6ZD2 ">24h Low ({SelectedCoin?.quote_currency})</div>
                                                        <div className="headline_title__x1csO text-danger font-weight-boldd" >
                                                            {Number(priceLow).toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="headline_leftItem__7BFYq">
                                                        <div className="headline_withBorder__a6ZD2">24h Volume ({SelectedCoin?.base_currency})</div>
                                                        <div className="headline_title__x1csO font-weight-boldd">{Number(volume).toFixed(2)}</div>
                                                    </div>
                                                    <div className="headline_leftItem__7BFYq">
                                                        <div className="headline_withBorder__a6ZD2">24h Volume ({SelectedCoin?.quote_currency}) </div>
                                                        <div className="headline_title__x1csO font-weight-boldd">

                                                            {parseFloat((SelectedCoin?.volumeQuote)?.toFixed(2)) || "0.00"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="notebookicon">
                                                <img src="/images/notebook.svg" alt="Notebook" />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="trade_card trade_chart p-0"  >
                                <div className="treade_card_header tch_main_tab">
                                    <div className={`card_header_title  cursor-pointer ${showTab === "chart" && "active"}`} onClick={() => setShowTab("chart")}> Chart  </div>
                                    <div className={`card_header_title  cursor-pointer ${showTab === "token_info" && "active"}`} onClick={() => { getDescAndLink(); setShowTab("token_info") }}>Info  </div>
                                    <div className={`card_header_title  cursor-pointer d-lg-none ${showTab === "order_book" && "active"}`} onClick={() => setShowTab("order_book")}> Order Book  </div>
                                    <div className={`card_header_title  cursor-pointer d-lg-none ${showTab === "trade_history" && "active"}`} onClick={() => setShowTab("trade_history")}> Market Trades </div>
                                    <div className={`card_header_title  cursor-pointer d-lg-none ${showTab === "wallets" && "active"}`} onClick={() => setShowTab("wallets")}> Wallets </div>

                                </div>
                                {/* tab 1 */}
                                <div id="tab_1" className={`cc_tab ${showTab !== "chart" && "d-none"}`} >
                                    <TVChartContainer symbol="BTC/USDT" />
                                </div>


                                {/* tab 2 */}
                                <div id="tab_2" className={`cc_tab ${showTab !== "token_info" && "d-none"}`} >
                                    <div className="inf_row scroll_y" >
                                        <div className="headline_symbolName__KfmIZ mt_tr_pr cursor-pointer">
                                            <div className="headline_bigName__dspVW me-2">
                                                <img alt="" src={SelectedCoin?.icon_path} width="24" className="img-fluid round_img" />
                                            </div>
                                            <div>
                                                <div className="headline_bigName__dspVW ">
                                                    <h1> {SelectedCoin?.base_currency_fullname || "N/A"}<i className="ri-arrow-down-s-fill"></i></h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row g-2 g-md-4 " >
                                            <div className="col-lg-6" >
                                                <ul className="infor_row"  >

                                                    <li>
                                                        Total Supply <span>{desAndLinks?.total_supply || "N/A"}</span>
                                                    </li>
                                                    <li>
                                                        Circulating Supply <span>{desAndLinks?.circulating_supply || "N/A"}</span>
                                                    </li>
                                                    <li>
                                                        Volume <span>{SelectedCoin?.volumeQuote?.toFixed(2) || "N/A"} {SelectedCoin?.quote_currency || "N/A"}</span>
                                                    </li>

                                                    <li>
                                                        Issue Date   <span>{desAndLinks?.issueDate || "N/A"}</span>
                                                    </li>
                                                    {(desAndLinks?.links?.length ?? 0) > 0 && desAndLinks?.links?.map((item: any) => {

                                                        return (
                                                            <li>
                                                                <a href={item?.description} target="_blank" rel="noreferrer">  {item?.name}   </a>
                                                            </li>
                                                        )
                                                    })}

                                                </ul>
                                            </div>
                                            <div className=" col-lg-6 t_info" >
                                                <h5>Information</h5>
                                                <p>
                                                    {desAndLinks?.description || ""}
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-12 col-xl-5 col-xxl-5 mmn_btm_minus_spc" >
                            <div className="row g-1 g-md-2 px-1 px-md-0" >
                                <div className="col-lg-6" >

                                    {/* tab 3 content is here - Order Book */}
                                    <div id="tab_3" className={`trade_card orderbook_two d-lg-block ${showTab !== "order_book" ? "d-none" : ""}`}>
                                        <div className="treade_card_header d-none d-lg-flex">
                                            <div className="menuitem">
                                                <div className={`card_header_title cursor-pointer ${orderBookActiveTab === "orderbook" ? "active" : ""}`} onClick={() => setOrderBookActiveTab("orderbook")}>Order Book</div>
                                                <div className={`card_header_title cursor-pointer ${orderBookActiveTab === "tradehistory" ? "active" : ""}`} onClick={() => setOrderBookActiveTab("tradehistory")}>Market Trades</div>
                                            </div>
                                            <div className="toggle_dotted">
                                                <i className="ri-more-2-fill"></i>
                                            </div>

                                        </div>

                                        {(orderBookActiveTab === "orderbook" || showTab === "order_book") && (
                                            <div className="orderbooktab">

                                                {/* TABS */}
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

                                                                {/* Asks (sell) — top, high → low */}
                                                                <div className="price_card_body scroll_y orderbook-side-scroll" style={{ position: 'relative', minHeight: '200px' }}>
                                                                    {loader ? (
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px' }}>
                                                                            <div className="spinner-border" style={{ width: '1.5rem', height: '1.5rem', borderColor: 'rgba(255, 255, 255, 0.3)', borderRightColor: 'transparent' }} />
                                                                        </div>
                                                                    ) : (
                                                                        <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss" style={{ width: '100%' }}>
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
                                                                                                onRowClick={() => {
                                                                                                    setbuyamount(formatQuantity(data.remaining));
                                                                                                    infoPlaceOrder !== "MARKET" && setbuyOrderPrice(formatPrice(data.price));
                                                                                                }}
                                                                                                formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                                                                formatQuantity={formatQuantity}
                                                                                                formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                                                            />
                                                                                        );
                                                                                    })
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan={3} className="text-center text-muted py-4">
                                                                                            No sell orders
                                                                                        </td>
                                                                                    </tr>
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

                                                                {/* Bids (buy) — bottom, high → low */}
                                                                <div className="price_card_body scroll_y orderbook-side-scroll" style={{ position: 'relative', minHeight: '200px' }}>
                                                                    {loader ? (
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px' }}>
                                                                            <div className="spinner-border" style={{ width: '1.5rem', height: '1.5rem', borderColor: 'rgba(255, 255, 255, 0.3)', borderRightColor: 'transparent' }} />
                                                                        </div>
                                                                    ) : (
                                                                        <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss" style={{ width: '100%' }}>
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
                                                                                                onRowClick={() => {
                                                                                                    setsellAmount(formatQuantity(data.remaining));
                                                                                                    infoPlaceOrder !== "MARKET" && setsellOrderPrice(formatPrice(data.price));
                                                                                                }}
                                                                                                formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                                                                formatQuantity={formatQuantity}
                                                                                                formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                                                            />
                                                                                        );
                                                                                    })
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan={3} className="text-center text-muted py-4">
                                                                                            No buy orders
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    )}
                                                                </div>

                                                                <OrderBookBidAskFooter bidPct={orderBookBidAskRatio.bidPct} askPct={orderBookBidAskRatio.askPct} />
                                                            </div>
                                                        </div>
                                                    )}

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
                                                                <div className="price_card_body scroll_y orderbook-single-side orderbook-bids-scroll" style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0 }}>

                                                                    <OrderBookMidPriceRow
                                                                        buyprice={buyprice}
                                                                        isPricePositive={isPricePositive}
                                                                        priceChange={priceChange}
                                                                        formatPriceThousands={formatPriceThousands}
                                                                        showChangePct={false}
                                                                        afterList
                                                                        accent="bid"
                                                                    />
                                                                    <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss" style={{ width: '100%' }}>
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
                                                                                        onRowClick={() => {
                                                                                            setsellAmount(formatQuantity(data.remaining));
                                                                                            infoPlaceOrder !== "MARKET" && setsellOrderPrice(formatPrice(data.price));
                                                                                        }}
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
                                                                {/* <OrderBookMidPriceRow
                                                                    buyprice={buyprice}
                                                                    isPricePositive={isPricePositive}
                                                                    priceChange={priceChange}
                                                                    formatPriceThousands={formatPriceThousands}
                                                                    showChangePct={false}
                                                                    afterList
                                                                    accent="bid"
                                                                /> */}
                                                                <OrderBookBidAskFooter bidPct={orderBookBidAskRatio.bidPct} askPct={orderBookBidAskRatio.askPct} />
                                                            </div>
                                                        </div>
                                                    )}

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
                                                                <div className="price_card_body scroll_y orderbook-single-side orderbook-asks-scroll" style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                                                    <table className="table table-sm table-borderless mb-0 orderbook-table orderbook-table--ss" style={{ width: '100%' }}>
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
                                                                                        onRowClick={() => {
                                                                                            setbuyamount(formatQuantity(data.remaining));
                                                                                            infoPlaceOrder !== "MARKET" && setbuyOrderPrice(formatPrice(data.price));
                                                                                        }}
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


                                        {(orderBookActiveTab === "tradehistory" && showTab !== "order_book") && (
                                            <div className="trade_history_tab">

                                                <div className="table-responsive" style={{ position: 'relative', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                                                    <table className="table table-sm table-borderless mb-0 orderbook-table" style={{ width: '100%' }}>
                                                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bs-body-bg, #12121a)', display: 'table-header-group' }}>
                                                            <tr>
                                                                <th className="text-start" style={{ position: 'sticky', top: 0, background: 'var(--bs-body-bg, #12121a)' }}>
                                                                    Price ({SelectedCoin?.quote_currency})
                                                                </th>
                                                                <th className="text-end" style={{ position: 'sticky', top: 0, background: 'var(--bs-body-bg, #12121a)' }}>
                                                                    Quantity ({SelectedCoin?.base_currency})
                                                                </th>
                                                                <th className="text-end" style={{ position: 'sticky', top: 0, background: 'var(--bs-body-bg, #12121a)' }}>
                                                                    Time
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="price_card_body">
                                                            {RecentTrade?.length > 0 ? (
                                                                RecentTrade.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td
                                                                            className={
                                                                                item?.side === "BUY"
                                                                                    ? "text-green text-start"
                                                                                    : "text-danger text-start"
                                                                            }
                                                                        >
                                                                            {parseFloat(item?.price || 0)}
                                                                        </td>

                                                                        <td className="text-end">
                                                                            {parseFloat(item?.quantity || 0)}
                                                                        </td>

                                                                        <td className="text-end">
                                                                            {item?.time || "---"}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr className="no-data-row">
                                                                    <td colSpan={12}>
                                                                        <div className="no-data-wrapper">
                                                                            <div className="no_data_s">
                                                                                <img src="/images/no_data_vector.svg" className="img-fluid dark_img" width="96" height="96" alt="" /><img src="/images/no_data_vector_light.png" className="img-fluid light_img" width="96" height="96" alt="" />
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
                                </div>

                                {/* Market Trades - Mobile Only (when trade_history tab is active) */}
                                <div className="col-lg-6 d-lg-none">
                                    <div id="tab_mobile_trade_history" className={`trade_card orderbook_two ${showTab !== "trade_history" ? "d-none" : ""}`}>
                                        <div className="trade_history_tab">
                                            <div className="table-responsive">
                                                <table className="table table-sm table-borderless mb-0 orderbook-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-start">
                                                                Price ({SelectedCoin?.quote_currency})
                                                            </th>
                                                            <th className="text-end">
                                                                Quantity ({SelectedCoin?.base_currency})
                                                            </th>
                                                            <th className="text-end">
                                                                Time
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="price_card_body">
                                                        {RecentTrade?.length > 0 ? (
                                                            RecentTrade.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td
                                                                        className={
                                                                            item?.side === "BUY"
                                                                                ? "text-green text-start"
                                                                                : "text-danger text-start"
                                                                        }
                                                                    >
                                                                        {parseFloat(item?.price || 0)}
                                                                    </td>
                                                                    <td className="text-end">
                                                                        {parseFloat(item?.quantity || 0)}
                                                                    </td>
                                                                    <td className="text-end">
                                                                        {item?.time || "---"}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr className="no-data-row">
                                                                <td colSpan={12}>
                                                                    <div className="no-data-wrapper">
                                                                        <div className="no_data_s">
                                                                            <img src="/images/no_data_vector.svg" className="img-fluid dark_img" width="96" height="96" alt="" /><img src="/images/no_data_vector_light.png" className="img-fluid light_img" width="96" height="96" alt="" />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Wallets - Mobile Only (when wallets tab is active) */}
                                <div className="col-lg-6 d-lg-none">
                                    <div className="assets_right mobile_assets_right">
                                        <div id="tab_4_mobile" className={`trade_card orderbook_two ${showTab !== "wallets" ? "d-none" : ""}`}>
                                            <div className="assets_list">
                                                <div className="top_heading"><h4>Spot Wallets<i className="ri-refresh-line cursor-pointer" onClick={() => fetchSpotWallets()}></i></h4><Link className="more_btn" to="/user_profile/asset_overview"><i className="ri-exchange-funds-fill"></i> Transfer</Link></div>

                                                <div className="assets_btn">
                                                    <button><Link to="/asset_managemnet/deposit">Deposit</Link></button>
                                                    <button><Link to="/asset_managemnet/withdraw">Withdrawal</Link></button>
                                                </div>
                                            </div>
                                            <div className="price_card">
                                                <div className="table-responsive price_card_body scroll_y scroll_y_mt">
                                                    {!token ? (
                                                        <div className="no-data-wrapper" style={{ padding: '40px 20px', textAlign: 'center' }}>
                                                            <div className="no_data_s">
                                                                <img src="/images/no_data_vector.svg" className="img-fluid dark_img" width="96" height="96" alt="" /><img src="/images/no_data_vector_light.png" className="img-fluid light_img" width="96" height="96" alt="" />
                                                                <p className=" mt-2">Please login to view your wallets</p>
                                                                <Link to="/login" className="btn btn-primary btn-sm mt-2">Login</Link>
                                                            </div>
                                                        </div>
                                                    ) : walletsLoading ? (
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                                                            <div className="spinner-border text-primary" role="status" style={{ width: '1.5rem', height: '1.5rem' }} />
                                                        </div>
                                                    ) : (
                                                        <table className="table table-sm table-borderless mb-0 orderbook-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Asset</th>
                                                                    <th className="text-end">Balance</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {spotWallets?.length > 0 ? (
                                                                    spotWallets.map((wallet, index) => (
                                                                        <tr key={wallet?._id || index}>
                                                                            <td>
                                                                                <div className="d-flex align-items-center">
                                                                                    <img
                                                                                        src={wallet?.icon_path}
                                                                                        alt={wallet?.short_name}
                                                                                        width="24"
                                                                                        height="24"
                                                                                        className="me-2 rounded-circle"
                                                                                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/coin_placeholder.png'; }}
                                                                                    />
                                                                                    <span>{wallet?.short_name}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="text-end">
                                                                                {parseFloat((wallet?.balance || 0).toFixed(8))}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr className="no-data-row">
                                                                        <td colSpan={2}>
                                                                            <div className="no-data-wrapper" style={{ padding: '20px', textAlign: 'center' }}>
                                                                                <div className="no_data_s">
                                                                                    <img src="/images/no_data_vector.svg" className="img-fluid dark_img" width="64" height="64" alt="" /><img src="/images/no_data_vector_light.png" className="img-fluid light_img" width="64" height="64" alt="" />
                                                                                    <p className="text-muted mt-2 mb-0" style={{ fontSize: '12px' }}>No assets in spot wallet</p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="bs_tab_row d-lg-none" >
                                        <div className="row gx-3" >
                                            <div className="col-6" >
                                                <button className="btn btn-success  btn-block w-100" onClick={() => setShowBuySellTab("buy")}>
                                                    <span>Buy</span>
                                                </button>
                                            </div>
                                            <div className="col-6" >

                                                <button className="btn btn-danger btn-block w-100" onClick={() => setShowBuySellTab("sell")}>
                                                    <span>Sell</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* buy sell dropbox is here */}
                                    <div className={`bs_dropbox d-lg-block ${!showBuySellTab && "d-none"}`} >
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="d-flex bottm_lightbox_two">

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
                                                            {/* </div> */}
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
                                                                                                        onRowClick={() => {
                                                                                                            setbuyamount(formatQuantity(data.remaining));
                                                                                                            infoPlaceOrder !== "MARKET" && setbuyOrderPrice(formatPrice(data.price));
                                                                                                        }}
                                                                                                        formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                                                                        formatQuantity={formatQuantity}
                                                                                                        formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                                                                    />
                                                                                                );
                                                                                            })
                                                                                        ) : (
                                                                                            <tr>
                                                                                                <td colSpan={3} className="text-center text-muted py-4">
                                                                                                    No sell orders
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
                                                                                                    onRowClick={() => {
                                                                                                        setsellAmount(formatQuantity(data.remaining));
                                                                                                        infoPlaceOrder !== "MARKET" && setsellOrderPrice(formatPrice(data.price));
                                                                                                    }}
                                                                                                    formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                                                                    formatQuantity={formatQuantity}
                                                                                                    formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                                                                />
                                                                                            );
                                                                                        })
                                                                                    ) : (
                                                                                        <tr>
                                                                                            <td colSpan={3} className="text-center text-muted py-4">
                                                                                                No buy orders
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
                                                                                                    onRowClick={() => {
                                                                                                        setsellAmount(formatQuantity(data.remaining));
                                                                                                        infoPlaceOrder !== "MARKET" && setsellOrderPrice(formatPrice(data.price));
                                                                                                    }}
                                                                                                    formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                                                                    formatQuantity={formatQuantity}
                                                                                                    formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                                                                />
                                                                                            );
                                                                                        })
                                                                                    ) : (
                                                                                        <tr>
                                                                                            <td colSpan={3} className="text-center">No data available</td>
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
                                                                                                    onRowClick={() => {
                                                                                                        setbuyamount(formatQuantity(data.remaining));
                                                                                                        infoPlaceOrder !== "MARKET" && setbuyOrderPrice(formatPrice(data.price));
                                                                                                    }}
                                                                                                    formatOrderBookAggPrice={formatOrderBookAggPrice}
                                                                                                    formatQuantity={formatQuantity}
                                                                                                    formatOrderBookNotionalShort={formatOrderBookNotionalShort}
                                                                                                />
                                                                                            );
                                                                                        })
                                                                                    ) : (
                                                                                        <tr>
                                                                                            <td colSpan={3} className="text-center">No data available</td>
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

                                                    <div className="trade_card trade_chart  buysell_card buysell_two">
                                                        <h3 className="headingspot">Spot</h3>
                                                        <div className="treade_card_header buysell_heder d-block ">
                                                            <div className="bs_box_header d-lg-none" >
                                                                <h6>
                                                                    Trade
                                                                </h6>
                                                                <span className="cursor-pointer" onClick={() => setShowBuySellTab("")}>
                                                                    <i className="ri-close-line"></i>
                                                                </span>
                                                            </div>
                                                            <ul className="nav custom-tabs padding-0">
                                                                <li className="buysell-tab buy-tab"><a href="#/" className={`${(showBuySellTab === "buy" || !showBuySellTab) ? "active" : ""}`} onClick={() => setShowBuySellTab("buy")}><button><span>Buy</span></button></a></li>
                                                                <li className="  sell-tab"><a href="#/" className={`${showBuySellTab === "sell" ? "active" : ""}`} onClick={() => setShowBuySellTab("sell")}><button><span>Sell</span></button></a></li>
                                                            </ul>
                                                        </div>
                                                        <div className=" p-2 p-md-3" >
                                                            <div className="col-md-12 mb-3">

                                                                <div className="d-flex align-items-center justify-content-between spottabs_top spot_limit_tabs_row">

                                                                    <div className="spot_limit d-flex align-items-center gap-4" >
                                                                        <button type="button" onClick={() => setinfoPlaceOrder("LIMIT")} className={`${infoPlaceOrder === "LIMIT" ? "active" : ""}`}>Limit</button>
                                                                        <button type="button" onClick={() => setinfoPlaceOrder("MARKET")} className={`${infoPlaceOrder === "MARKET" ? "active" : ""}`}>Market</button>
                                                                        <div className="spot_limit_dropdown">
                                                                            <button
                                                                                type="button"
                                                                                className={`spot_limit_dd_btn ${infoPlaceOrder === "STOP_LIMIT" || infoPlaceOrder === "STOP_MARKET" ? "active" : ""}`}
                                                                                onClick={() => setIsConditionalMenuOpen((v) => !v)}
                                                                            >
                                                                                {infoPlaceOrder === "STOP_LIMIT"
                                                                                    ? "Stop Limit"
                                                                                    : infoPlaceOrder === "STOP_MARKET"
                                                                                        ? "Stop Market"
                                                                                        : "Conditional"}{" "}
                                                                                <i className="ri-arrow-down-s-fill" />
                                                                            </button>
                                                                            {isConditionalMenuOpen ? (
                                                                                <div className="spot_limit_dd_menu" role="menu">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="spot_limit_dd_item"
                                                                                        role="menuitem"
                                                                                        onClick={() => {
                                                                                            setinfoPlaceOrder("STOP_LIMIT");
                                                                                            setIsConditionalMenuOpen(false);
                                                                                        }}
                                                                                    >
                                                                                        Stop Limit
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="spot_limit_dd_item"
                                                                                        role="menuitem"
                                                                                        onClick={() => {
                                                                                            setinfoPlaceOrder("STOP_MARKET");
                                                                                            setIsConditionalMenuOpen(false);
                                                                                        }}
                                                                                    >
                                                                                        Stop Market
                                                                                    </button>
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                        {/* <select className=" mb-0 form-select-sm" name="infoPlaceOrder" onChange={handleOrderType} value={infoPlaceOrder}>
                                                                        <option value="LIMIT" >Limit</option>
                                                                        <option value="MARKET">Market</option>
                                                                    </select> */}
                                                                    </div>

                                                                    <div className="info_icon">
                                                                        <i className="ri-information-fill" />
                                                                    </div>

                                                                </div>

                                                            </div>
                                                            <div className="tab-content" >
                                                                <div className={`tab-pane px-0 ${(showBuySellTab === "buy" || !showBuySellTab) ? "show active" : ''}`} id="buytab" >
                                                                    <form action="" className="buysellform data-buy buy_spot_form">
                                                                        {infoPlaceOrder === "STOP_LIMIT" || infoPlaceOrder === "STOP_MARKET" ? (
                                                                            <div className="form-group  mb-3">
                                                                                <label>Stop</label>
                                                                                <div className="input-group">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={buyStopPrice !== '' ? buyStopPrice : formatTotal(buyprice || 0)}
                                                                                        step={SelectedCoin?.tick_size || 0.01}
                                                                                        min={SelectedCoin?.tick_size || 0.01}
                                                                                        onChange={(e) => handlePriceInput(e.target.value, setBuyStopPrice)}
                                                                                        onBlur={(e) => handlePriceBlur(e.target.value, setBuyStopPrice)}
                                                                                    />
                                                                                    <span className="input-group-text text-start">
                                                                                        <small>{SelectedCoin?.quote_currency}</small>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                        <div className="form-group mb-3 trade_price_field_wrap">
                                                                            <label>Price</label>
                                                                            {infoPlaceOrder === "MARKET" || infoPlaceOrder === "STOP_MARKET" ? (
                                                                                <div className="trade_price_field is-readonly">
                                                                                    <input type="text" className="trade_price_input" readOnly value="---Best Market Price---" />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="trade_price_field">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="trade_price_input"
                                                                                        inputMode="decimal"
                                                                                        autoComplete="off"
                                                                                        value={
                                                                                            priceFieldFocus === "buy"
                                                                                                ? (buyOrderPrice !== "" ? buyOrderPrice : formatTotal(buyprice || 0))
                                                                                                : formatPriceThousands(buyOrderPrice !== "" ? buyOrderPrice : String(buyprice ?? ""))
                                                                                        }
                                                                                        onFocus={() => setPriceFieldFocus("buy")}
                                                                                        onBlur={(e) => {
                                                                                            handlePriceBlur(e.target.value, setbuyOrderPrice);
                                                                                            setPriceFieldFocus((f) => (f === "buy" ? null : f));
                                                                                        }}
                                                                                        onChange={(e) => handlePriceInput(e.target.value, setbuyOrderPrice)}
                                                                                    />
                                                                                    <span className="trade_price_suffix">{SelectedCoin?.quote_currency}</span>
                                                                                    <div className="trade_price_stepper" role="group" aria-label="Adjust price">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="trade_price_step_btn"
                                                                                            aria-label="Increase price"
                                                                                            onMouseDown={(e) => e.preventDefault()}
                                                                                            onClick={() => nudgeBuyOrderPrice(1)}
                                                                                        >
                                                                                            <span className="trade_price_step_icon trade_price_step_up" aria-hidden />
                                                                                        </button>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="trade_price_step_btn lastbtnprice"
                                                                                            aria-label="Decrease price"
                                                                                            onMouseDown={(e) => e.preventDefault()}
                                                                                            onClick={() => nudgeBuyOrderPrice(-1)}
                                                                                        >
                                                                                            <span className="trade_price_step_icon trade_price_step_down" aria-hidden />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="form-group mb-3 trade_amount_field_wrap">
                                                                            <label>Amount</label>
                                                                            <div className="input-group trade_amount_field_limit">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    aria-label="Amount"
                                                                                    value={buyamount}
                                                                                    step={SelectedCoin?.step_size || 0.00001}
                                                                                    min={SelectedCoin?.step_size || 0.00001}
                                                                                    onChange={(e) => handleQuantityInput(e.target.value, setbuyamount)}
                                                                                    onBlur={(e) => handleQuantityBlur(e.target.value, setbuyamount)}
                                                                                />
                                                                                <span className={`input-group-text text-start ${isStopOrder ? "stop_amt_suffix" : ""} trade_amount_coin_badge`}>
                                                                                    <small>{SelectedCoin?.base_currency}</small>
                                                                                    {isStopOrder ? <i className="ri-arrow-down-s-line ms-1" aria-hidden="true" /> : null}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        {!isStopOrder ? (
                                                                            <div className="form-group mb-3 trade_total_field_wrap">
                                                                                <label>Total</label>
                                                                                <div className="input-group trade_total_field">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        readOnly
                                                                                        value={
                                                                                            (buyamount && (buyOrderPrice !== "" || buyprice))
                                                                                                ? formatTotal((+(buyOrderPrice !== "" && buyOrderPrice ? buyOrderPrice : buyprice) || 0) * +buyamount)
                                                                                                : formatTotal(0)
                                                                                        }
                                                                                    />
                                                                                    <span className="input-group-text text-start">
                                                                                        <small>{SelectedCoin?.quote_currency}</small>
                                                                                    </span>
                                                                                </div>
                                                                                {/* {isLimitBuyUi ? (
                                                                                    <div className="trade_total_min_hint">
                                                                                        ≥ {SelectedCoin?.min_notional ?? 1} {SelectedCoin?.quote_currency}
                                                                                    </div>
                                                                                ) : null} */}
                                                                            </div>
                                                                        ) : null}

                                                                        {infoPlaceOrder === "MARKET" || infoPlaceOrder === "STOP_MARKET" ? (
                                                                            <div className="form-group mb-3 trade_amount_field_wrap slippage_check_fill">
                                                                                <label className="stopslippage_check">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={buySlippageEnabled}
                                                                                        onChange={(e) => setBuySlippageEnabled(e.target.checked)}
                                                                                    />
                                                                                    <span>Slippage</span>
                                                                                </label>
                                                                                {buySlippageEnabled ? (
                                                                                    <div className="input-group trade_amount_field_limit">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="1-3"
                                                                                            value={buySlippageInput}
                                                                                            onChange={(e) => setBuySlippageInput(e.target.value)}
                                                                                            aria-label="Slippage tolerance percent"
                                                                                        />
                                                                                        <span className="input-group-text text-start trade_amount_coin_badge">
                                                                                            <small>%</small>
                                                                                        </span>
                                                                                    </div>
                                                                                ) : null}
                                                                            </div>
                                                                        ) : null}
                                                                        {isStopOrder ? (
                                                                            <div className="stop_order_block">
                                                                                <div className="stop_slider_row trade_pct_slider_row">
                                                                                    <div className="trade_pct_slider_shell" style={{ "--fill-pct": `${stopPercent}%` } as React.CSSProperties}>
                                                                                        <div className="trade_pct_track_line" aria-hidden />
                                                                                        <input
                                                                                            className="trade_pct_slider_input"
                                                                                            type="range"
                                                                                            min={0}
                                                                                            max={100}
                                                                                            step={25}
                                                                                            value={stopPercent}
                                                                                            onChange={(e) => setStopPercent(Number(e.target.value))}
                                                                                        />
                                                                                        <div className="trade_pct_marks" aria-hidden>
                                                                                            {[0, 1, 2, 3, 4].map((step) => (
                                                                                                <span
                                                                                                    key={step}
                                                                                                    className={`trade_pct_dot ${step === 0 ? "trade_pct_dot--anchor" : ""} ${step * 25 <= stopPercent ? "trade_pct_dot--fill" : ""}`}
                                                                                                />
                                                                                            ))}
                                                                                        </div>
                                                                                        <div className="trade_pct_labels" aria-hidden>
                                                                                            <span>0%</span>
                                                                                            <span>25%</span>
                                                                                            <span>50%</span>
                                                                                            <span>75%</span>
                                                                                            <span>100%</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                        {isLimitBuyUi ? (
                                                                            <div className="limit_buy_extras">
                                                                                <div className="stop_slider_row limit_buy_slider_row trade_pct_slider_row">
                                                                                    <div className="trade_pct_slider_shell" style={{ "--fill-pct": `${limitBuyPercent}%` } as React.CSSProperties}>
                                                                                        <div className="trade_pct_track_line" aria-hidden />
                                                                                        <input
                                                                                            className="trade_pct_slider_input"
                                                                                            type="range"
                                                                                            min={0}
                                                                                            max={100}
                                                                                            step={25}
                                                                                            value={limitBuyPercent}
                                                                                            onChange={(e) => applyLimitBuySlider(Number(e.target.value))}
                                                                                        />
                                                                                        <div className="trade_pct_marks" aria-hidden>
                                                                                            {[0, 1, 2, 3, 4].map((step) => (
                                                                                                <span
                                                                                                    key={step}
                                                                                                    className={`trade_pct_dot ${step === 0 ? "trade_pct_dot--anchor" : ""} ${step * 25 <= limitBuyPercent ? "trade_pct_dot--fill" : ""}`}
                                                                                                />
                                                                                            ))}
                                                                                        </div>
                                                                                        <div className="trade_pct_labels" aria-hidden>
                                                                                            <span>0%</span>
                                                                                            <span>25%</span>
                                                                                            <span>50%</span>
                                                                                            <span>75%</span>
                                                                                            <span>100%</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                        {!isStopOrder && infoPlaceOrder === "MARKET" ? (
                                                                            <div className="stop_slider_row trade_pct_slider_row market_pct_slider_row">
                                                                                <div className="trade_pct_slider_shell" style={{ "--fill-pct": `${marketBuyPercent}%` } as React.CSSProperties}>
                                                                                    <div className="trade_pct_track_line" aria-hidden />
                                                                                    <input
                                                                                        className="trade_pct_slider_input"
                                                                                        type="range"
                                                                                        min={0}
                                                                                        max={100}
                                                                                        step={25}
                                                                                        value={marketBuyPercent}
                                                                                        onChange={(e) => applyMarketBuySlider(Number(e.target.value))}
                                                                                    />
                                                                                    <div className="trade_pct_marks" aria-hidden>
                                                                                        {[0, 1, 2, 3, 4].map((step) => (
                                                                                            <span
                                                                                                key={step}
                                                                                                className={`trade_pct_dot ${step === 0 ? "trade_pct_dot--anchor" : ""} ${step * 25 <= marketBuyPercent ? "trade_pct_dot--fill" : ""}`}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                    <div className="trade_pct_labels" aria-hidden>
                                                                                        <span>0%</span>
                                                                                        <span>25%</span>
                                                                                        <span>50%</span>
                                                                                        <span>75%</span>
                                                                                        <span>100%</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}

                                                                        {showSpotOrderFooter ? (
                                                                            <>
                                                                                <div className="stop_avail_block limit_buy_avail">
                                                                                    <div className="stop_avail_row limit_buy_avail_row">
                                                                                        <span className="stop_avail_label">Available</span>
                                                                                        <div className="stop_avail_rgt">
                                                                                            <span className="stop_avail_val">
                                                                                                {token ? `${BuyCoinBal ? parseFloat(BuyCoinBal.toFixed(8)) : "0.00"} ${SelectedCoin?.quote_currency}` : `-- ${SelectedCoin?.quote_currency}`}
                                                                                            </span>
                                                                                            <Link className="limit_buy_plus" to={token ? "/asset_managemnet/deposit" : "/login"} aria-label="Deposit">
                                                                                                <img src="/images/plushicon.svg" alt="plus" />
                                                                                            </Link>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="stop_avail_row limit_buy_avail_row">
                                                                                        <span className="stop_avail_label">Max</span>
                                                                                        <span className="stop_avail_val">
                                                                                            {token && BuyCoinBal
                                                                                                ? `${formatTotal(BuyCoinBal)} ${SelectedCoin?.quote_currency}`
                                                                                                : `0 ${SelectedCoin?.quote_currency}`}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="stop_checks limit_buy_checks">
                                                                                    <label className="stop_check">
                                                                                        <input type="checkbox" checked={limitBuyFok} onChange={(e) => setLimitBuyFok(e.target.checked)} />
                                                                                        <span>FOK</span>
                                                                                    </label>
                                                                                    <label className="stop_check">
                                                                                        <input type="checkbox" checked={limitBuyIoc} onChange={(e) => setLimitBuyIoc(e.target.checked)} />
                                                                                        <span>IOC</span>
                                                                                    </label>
                                                                                </div>
                                                                            </>
                                                                        ) : null}

                                                                        {/* <small className="mb-2">Minimal Buy : 10 USDT</small> */}
                                                                        <>
                                                                            {token ?
                                                                                KycStatus === 0 || KycStatus === 1 || KycStatus === 3 ?
                                                                                    <Link to={KycStatus === 1 ? "" : '/user_profile/kyc'
                                                                                    } className={`btn custom-btn btn-success btn-mini  w-100 my-3 my-md-0`}>
                                                                                        {KycStatus === 1 ? "Verification Pending" : KycStatus === 0 ? "Submit Kyc" : "Kyc Rejected Verify Again"}
                                                                                    </Link> :
                                                                                    <button type='button' className="btn custom-btn btn-success btn-mini  w-100 my-3 my-md-0"
                                                                                        onClick={() => !isSpotDisabled && handleOrderPlace(infoPlaceOrder, buyOrderPrice !== '' && buyOrderPrice ? buyOrderPrice : buyprice, buyamount, SelectedCoin?.base_currency_id, SelectedCoin?.quote_currency_id, 'BUY')}
                                                                                        disabled={isSpotDisabled}>
                                                                                        {isSpotDisabled ? 'Trading Disabled' : `Buy ${SelectedCoin?.base_currency}`}
                                                                                    </button>
                                                                                :
                                                                                <div className="order-btns my-2" >
                                                                                    <button type='button' className="btn custom-btn btn-success btn-mini  w-100 my-3 my-md-0"
                                                                                        onClick={() => navigate("/login")}>
                                                                                        Login
                                                                                    </button>

                                                                                </div>
                                                                            }


                                                                        </>
                                                                        {showSpotOrderFooter ? (
                                                                            <p className="trade_maker_taker_fees trade_maker_fees_split">
                                                                                <span className="trade_maker_fee_item">
                                                                                    Maker {SelectedCoin?.maker_fee ?? 0.2}%
                                                                                </span>
                                                                                <span className="trade_maker_fee_item">
                                                                                    Taker {SelectedCoin?.taker_fee ?? 0.2}%
                                                                                </span>
                                                                            </p>
                                                                        ) : null}
                                                                        {showSpotOrderFooter ? (
                                                                            <div className="stop_apr_card" role="button" tabIndex={0}>
                                                                                <span className="stop_apr_text">{SelectedCoin?.base_currency || "BTC"} Staking Estimated APR: 2.45%</span>
                                                                                <i className="ri-arrow-right-s-line" aria-hidden="true" />
                                                                            </div>
                                                                        ) : null}
                                                                    </form>
                                                                </div>
                                                                <div className={`tab-pane px-0 ${showBuySellTab === "sell" ? "show active" : ""}`} id="selltab" >
                                                                    <form action="" className="buysellform data-sell sell_spot_form">
                                                                        {infoPlaceOrder === "STOP_LIMIT" || infoPlaceOrder === "STOP_MARKET" ? (
                                                                            <div className="form-group  mb-3">
                                                                                <label>Stop</label>
                                                                                <div className="input-group ">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={sellStopPrice !== '' ? sellStopPrice : formatTotal(sellPrice || 0)}
                                                                                        step={SelectedCoin?.tick_size || 0.01}
                                                                                        min={SelectedCoin?.tick_size || 0.01}
                                                                                        onChange={(e) => handlePriceInput(e.target.value, setSellStopPrice)}
                                                                                        onBlur={(e) => handlePriceBlur(e.target.value, setSellStopPrice)}
                                                                                    />
                                                                                    <span className="input-group-text text-start">
                                                                                        <small>{SelectedCoin?.quote_currency}</small>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                        <div className="form-group mb-3 trade_price_field_wrap">
                                                                            <label>Price</label>
                                                                            {infoPlaceOrder === "MARKET" || infoPlaceOrder === "STOP_MARKET" ? (
                                                                                <div className="trade_price_field is-readonly">
                                                                                    <input type="text" className="trade_price_input" readOnly value="Best Market Price" />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="trade_price_field">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="trade_price_input"
                                                                                        inputMode="decimal"
                                                                                        autoComplete="off"
                                                                                        aria-label="Price"
                                                                                        value={
                                                                                            priceFieldFocus === "sell"
                                                                                                ? (sellOrderPrice !== "" ? sellOrderPrice : formatTotal(sellPrice || 0))
                                                                                                : formatPriceThousands(sellOrderPrice !== "" ? sellOrderPrice : String(sellPrice ?? ""))
                                                                                        }
                                                                                        onFocus={() => setPriceFieldFocus("sell")}
                                                                                        onBlur={(e) => {
                                                                                            handlePriceBlur(e.target.value, setsellOrderPrice);
                                                                                            setPriceFieldFocus((f) => (f === "sell" ? null : f));
                                                                                        }}
                                                                                        onChange={(e) => handlePriceInput(e.target.value, setsellOrderPrice)}
                                                                                    />
                                                                                    <span className="trade_price_suffix">{SelectedCoin?.quote_currency}</span>
                                                                                    <div className="trade_price_stepper" role="group" aria-label="Adjust price">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="trade_price_step_btn"
                                                                                            aria-label="Increase price"
                                                                                            onMouseDown={(e) => e.preventDefault()}
                                                                                            onClick={() => nudgeSellOrderPrice(1)}
                                                                                        >
                                                                                            <span className="trade_price_step_icon trade_price_step_up" aria-hidden />
                                                                                        </button>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="trade_price_step_btn"
                                                                                            aria-label="Decrease price"
                                                                                            onMouseDown={(e) => e.preventDefault()}
                                                                                            onClick={() => nudgeSellOrderPrice(-1)}
                                                                                        >
                                                                                            <span className="trade_price_step_icon trade_price_step_down" aria-hidden />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="form-group mb-3 trade_amount_field_wrap">
                                                                            <label>Amount</label>
                                                                            <div className="input-group trade_amount_field_limit">
                                                                                <input type="text" aria-invalid="true" className="form-control" aria-label="Amount (to the nearest dollar)" value={sellAmount}
                                                                                    step={SelectedCoin?.step_size || 0.00001}
                                                                                    min={SelectedCoin?.step_size || 0.00001}
                                                                                    onChange={(e) => handleQuantityInput(e.target.value, setsellAmount)}
                                                                                    onBlur={(e) => handleQuantityBlur(e.target.value, setsellAmount)}
                                                                                />
                                                                                <span className={`input-group-text text-start ${isStopOrder ? "stop_amt_suffix" : ""} trade_amount_coin_badge`}>
                                                                                    <small>{SelectedCoin?.base_currency}</small>
                                                                                    {isStopOrder ? <i className="ri-arrow-down-s-line ms-1" aria-hidden="true" /> : null}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {!isStopOrder && infoPlaceOrder !== "MARKET" ? (
                                                                            <div className="form-group  mb-3" >
                                                                                <label>Total</label>
                                                                                <div className="input-group  ">
                                                                                    <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" readOnly value=
                                                                                        {(sellAmount && (sellOrderPrice !== '' || sellPrice))
                                                                                            ? formatTotal((+(sellOrderPrice !== '' && sellOrderPrice ? sellOrderPrice : sellPrice) || 0) * +sellAmount)
                                                                                            : formatTotal(0)}

                                                                                    />
                                                                                    <span className="input-group-text text-start"><small>Total</small></span>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                        {isStopOrder ? (
                                                                            <div className="stop_order_block">
                                                                                <div className="stop_slider_row trade_pct_slider_row">
                                                                                    <div className="trade_pct_slider_shell" style={{ "--fill-pct": `${stopPercent}%` } as React.CSSProperties}>
                                                                                        <div className="trade_pct_track_line" aria-hidden />
                                                                                        <input
                                                                                            className="trade_pct_slider_input"
                                                                                            type="range"
                                                                                            min={0}
                                                                                            max={100}
                                                                                            step={25}
                                                                                            value={stopPercent}
                                                                                            onChange={(e) => setStopPercent(Number(e.target.value))}
                                                                                        />
                                                                                        <div className="trade_pct_marks" aria-hidden>
                                                                                            {[0, 1, 2, 3, 4].map((step) => (
                                                                                                <span
                                                                                                    key={step}
                                                                                                    className={`trade_pct_dot ${step === 0 ? "trade_pct_dot--anchor" : ""} ${step * 25 <= stopPercent ? "trade_pct_dot--fill" : ""}`}
                                                                                                />
                                                                                            ))}
                                                                                        </div>
                                                                                        <div className="trade_pct_labels" aria-hidden>
                                                                                            <span>0%</span>
                                                                                            <span>25%</span>
                                                                                            <span>50%</span>
                                                                                            <span>75%</span>
                                                                                            <span>100%</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                        {isLimitBuyUi ? (
                                                                            <div className="limit_buy_extras">
                                                                                <div className="stop_slider_row limit_buy_slider_row trade_pct_slider_row">
                                                                                    <div className="trade_pct_slider_shell" style={{ "--fill-pct": `${limitSellPercent}%` } as React.CSSProperties}>
                                                                                        <div className="trade_pct_track_line" aria-hidden />
                                                                                        <input
                                                                                            className="trade_pct_slider_input"
                                                                                            type="range"
                                                                                            min={0}
                                                                                            max={100}
                                                                                            step={25}
                                                                                            value={limitSellPercent}
                                                                                            onChange={(e) => applyLimitSellSlider(Number(e.target.value))}
                                                                                        />
                                                                                        <div className="trade_pct_marks" aria-hidden>
                                                                                            {[0, 1, 2, 3, 4].map((step) => (
                                                                                                <span
                                                                                                    key={step}
                                                                                                    className={`trade_pct_dot ${step === 0 ? "trade_pct_dot--anchor" : ""} ${step * 25 <= limitSellPercent ? "trade_pct_dot--fill" : ""}`}
                                                                                                />
                                                                                            ))}
                                                                                        </div>
                                                                                        <div className="trade_pct_labels" aria-hidden>
                                                                                            <span>0%</span>
                                                                                            <span>25%</span>
                                                                                            <span>50%</span>
                                                                                            <span>75%</span>
                                                                                            <span>100%</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                        {!isStopOrder && infoPlaceOrder === "MARKET" ? (
                                                                            <div className="stop_slider_row trade_pct_slider_row market_pct_slider_row">
                                                                                <div className="trade_pct_slider_shell" style={{ "--fill-pct": `${marketSellPercent}%` } as React.CSSProperties}>
                                                                                    <div className="trade_pct_track_line" aria-hidden />
                                                                                    <input
                                                                                        className="trade_pct_slider_input"
                                                                                        type="range"
                                                                                        min={0}
                                                                                        max={100}
                                                                                        step={25}
                                                                                        value={marketSellPercent}
                                                                                        onChange={(e) => applyMarketSellSlider(Number(e.target.value))}
                                                                                    />
                                                                                    <div className="trade_pct_marks" aria-hidden>
                                                                                        {[0, 1, 2, 3, 4].map((step) => (
                                                                                            <span
                                                                                                key={step}
                                                                                                className={`trade_pct_dot ${step === 0 ? "trade_pct_dot--anchor" : ""} ${step * 25 <= marketSellPercent ? "trade_pct_dot--fill" : ""}`}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                    <div className="trade_pct_labels" aria-hidden>
                                                                                        <span>0%</span>
                                                                                        <span>25%</span>
                                                                                        <span>50%</span>
                                                                                        <span>75%</span>
                                                                                        <span>100%</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null}

                                                                        {showSpotOrderFooter ? (
                                                                            <>
                                                                                <div className="stop_avail_block limit_buy_avail">
                                                                                    <div className="stop_avail_row limit_buy_avail_row">
                                                                                        <span className="stop_avail_label">Available</span>
                                                                                        <div className="stop_avail_rgt">
                                                                                            <span className="stop_avail_val">
                                                                                                {token ? `${SellCoinBal ? parseFloat(SellCoinBal.toFixed(8)) : "0.00"} ${SelectedCoin?.base_currency}` : `-- ${SelectedCoin?.base_currency}`}
                                                                                            </span>
                                                                                            <Link className="limit_buy_plus" to={token ? "/asset_managemnet/deposit" : "/login"} aria-label="Deposit">
                                                                                                <img src="/images/plushicon.svg" alt="plus" />
                                                                                            </Link>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="stop_avail_row limit_buy_avail_row">
                                                                                        <span className="stop_avail_label">Max</span>
                                                                                        <span className="stop_avail_val">
                                                                                            {token && SellCoinBal
                                                                                                ? `${formatTotal(SellCoinBal)} ${SelectedCoin?.base_currency}`
                                                                                                : `0 ${SelectedCoin?.base_currency}`}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="stop_checks limit_buy_checks">
                                                                                    <label className="stop_check">
                                                                                        <input type="checkbox" checked={limitSellFok} onChange={(e) => setLimitSellFok(e.target.checked)} />
                                                                                        <span>FOK</span>
                                                                                    </label>
                                                                                    <label className="stop_check">
                                                                                        <input type="checkbox" checked={limitSellIoc} onChange={(e) => setLimitSellIoc(e.target.checked)} />
                                                                                        <span>IOC</span>
                                                                                    </label>
                                                                                </div>
                                                                            </>
                                                                        ) : null}
                                                                        {/* <small className="">Minimal Sell: {nineDecimalFormat(10 / SelectedCoin?.buy_price)} {SelectedCoin?.base_currency}</small> */}

                                                                        <>

                                                                            {token ?
                                                                                KycStatus === 0 || KycStatus === 1 || KycStatus === 3 ?
                                                                                    <Link to={KycStatus === 1 ? "" : '/user_profile/kyc'
                                                                                    } className={`btn custom-btn btn-danger btn-mini w-100 my-3 my-md-0`}>
                                                                                        {KycStatus === 1 ? "Verification Pending" : KycStatus === 0 ? "Submit Kyc" : "Kyc Rejected Verify Again"}
                                                                                    </Link> :
                                                                                    <button type='button' className="btn custom-btn btn-danger btn-mini w-100 my-3 my-md-0"
                                                                                        onClick={() => !isSpotDisabled && handleOrderPlace(infoPlaceOrder, sellOrderPrice !== '' && sellOrderPrice ? sellOrderPrice : sellPrice, sellAmount, SelectedCoin?.base_currency_id, SelectedCoin?.quote_currency_id, 'SELL')}
                                                                                        disabled={!sellAmount || !token || sellAmount === 0 || isSpotDisabled}>
                                                                                        {isSpotDisabled ? 'Trading Disabled' : `Sell ${SelectedCoin?.base_currency}`}
                                                                                    </button>
                                                                                :
                                                                                <div className="order-btns my-2" >
                                                                                    <button type='button' className="btn custom-btn btn-success btn-mini  w-100 my-3 my-md-0"
                                                                                        onClick={() => navigate("/login")}>
                                                                                        Login
                                                                                    </button>

                                                                                    {/* <Link to='/signup' className="btn  custom-border-btn  custom-border-btn-white  btn-mini w-100  ">
                                                                            Register
                                                                        </Link> */}
                                                                                </div>
                                                                            }

                                                                        </>
                                                                        {showSpotOrderFooter ? (
                                                                            <p className="trade_maker_taker_fees trade_maker_fees_split">
                                                                                <span className="trade_maker_fee_item">
                                                                                    Maker {SelectedCoin?.maker_fee ?? 0.2}%
                                                                                </span>
                                                                                <span className="trade_maker_fee_item">
                                                                                    Taker {SelectedCoin?.taker_fee ?? 0.2}%
                                                                                </span>
                                                                            </p>
                                                                        ) : null}
                                                                        {showSpotOrderFooter ? (
                                                                            <div className="stop_apr_card" role="button" tabIndex={0}>
                                                                                <span className="stop_apr_text">{SelectedCoin?.base_currency || "BTC"} Staking Estimated APR: 2.45%</span>
                                                                                <i className="ri-arrow-right-s-line" aria-hidden="true" />
                                                                            </div>
                                                                        ) : null}
                                                                    </form>
                                                                </div>

                                                            </div>


                                                            {/* <div className="freerate">
                                                                <span>Fee rate</span>  Maker {SelectedCoin?.maker_fee
                                                                    || "---"}%/ Taker {SelectedCoin?.taker_fee
                                                                        || "---"}%
                                                            </div> */}

                                                        </div>


                                                        {/* <div className="assets_list">

                                                            <ul>
                                                                <li>Coin<span>Total Assets</span></li>

                                                                <li>{SelectedCoin?.quote_currency}<span>{BuyCoinBal ? BuyCoinBal?.toFixed(9) : "0.00"}</span></li>
                                                                <li>{SelectedCoin?.base_currency}<span>{SellCoinBal ? SellCoinBal?.toFixed(9) : "0.00"}</span></li>
                                                            </ul>

                                                        </div> */}


                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="trade_account_summary_assets">

                            <div className="trade_summary_table_lft mt-0 position_order trade_summary_table_lft_position_order">
                                <div className="top_th_easyop border-0 spot_orders_top">
                                    <ul className="position_list spot_orders_primary_tabs">
                                        <li className={`nav-item positions ${positionOrderTab === "positions" ? "active" : ""}`} role="presentation">
                                            <button type="button" onClick={() => setPositionOrderTab("positions")}>Open Orders</button>
                                        </li>
                                        <li className={`nav-item orderHistory ${positionOrderTab === "orderHistory" ? "active" : ""}`} role="presentation">
                                            <button type="button" onClick={() => setPositionOrderTab("orderHistory")}>Order History</button>
                                        </li>
                                        <li className={`nav-item tradeHistory ${positionOrderTab === "tradeHistory" ? "active" : ""}`} role="presentation">
                                            <button type="button" onClick={() => setPositionOrderTab("tradeHistory")}>Trade History</button>
                                        </li>
                                        <li className={`nav-item bots ${positionOrderTab === "bots" ? "active" : ""}`} role="presentation">
                                            <button type="button" onClick={() => setPositionOrderTab("bots")}>Bots(0)</button>
                                        </li>
                                    </ul>
                                </div>

                                {positionOrderTab === "positions" ? (
                                    <div className="spot_orders_filter_bar">
                                        <div className="spot_orders_filter_chips">
                                            {SPOT_OPEN_ORDER_KINDS.map((k) => (
                                                <button
                                                    key={k.id}
                                                    type="button"
                                                    className={`spot_orders_chip ${openOrderKindTab === k.id ? "is-active" : ""}`}
                                                    onClick={() => setOpenOrderKindTab(k.id)}
                                                >
                                                    {k.label}
                                                </button>
                                            ))}

                                            <div className="spot_orders_filter_actions">
                                                <select
                                                    className="spot_orders_side_select"
                                                    value={orderType}
                                                    onChange={(e) => setorderType(e.target.value)}
                                                    aria-label="All Sides"
                                                >
                                                    <option value="All">All Sides</option>
                                                    <option value="BUY">Buy</option>
                                                    <option value="SELL">Sell</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    className="spot_orders_reset"
                                                    onClick={() => {
                                                        setOpenOrderKindTab("limit_market");
                                                        setorderType("All");
                                                    }}
                                                >
                                                    <i className="ri-refresh-line" aria-hidden="true" />
                                                    Reset
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ) : null}

                                <div className={`cnt_table positions ${positionOrderTab === "positions" ? "active" : ""}`}>

                                    <div className="desktop_view2">
                                        <div className="table-responsive spot_orders_table_wrap" style={{ minHeight: "320px" }}>

                                            <table className="table table_home spot_orders_table">
                                                <thead>
                                                    <tr>
                                                        <th>Market</th>
                                                        <th>Date</th>
                                                        <th>Side</th>
                                                        <th>Price</th>
                                                        <th>Filled/Amount</th>
                                                        <th>TP/SL</th>
                                                        <th>Type</th>
                                                        <th>Iceberg Qty</th>
                                                        <th>Filled/Total</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {openOrders?.length > 0 ? (
                                                        openOrders
                                                            .filter((item) => orderType === item?.side || orderType === "All")
                                                            .map((item, index) => (
                                                                <tr key={item?._id || index}>
                                                                    <td>{`${SelectedCoin?.base_currency}/${SelectedCoin?.quote_currency}`}</td>
                                                                    <td>
                                                                        <small>
                                                                            <div className="c_view justify-content-start" >
                                                                                <span>{moment(item?.updatedAt).format("DD/MM/YYYY")}{" "}
                                                                                    <small>{moment(item?.updatedAt).format("hh:mm")}</small>
                                                                                </span>
                                                                            </div>
                                                                        </small>
                                                                    </td>
                                                                    <td>{item?.side}</td>
                                                                    <td>{item?.price?.toFixed(8)}</td>
                                                                    <td>{`${nineDecimalFormat(Number(item?.filled ?? 0))} / ${nineDecimalFormat(Number(item?.quantity ?? 0))}`}</td>
                                                                    <td>—</td>
                                                                    <td>{item?.order_type}</td>
                                                                    <td>—</td>
                                                                    <td>{`${nineDecimalFormat(Number(item?.filled ?? 0))} / ${nineDecimalFormat(Number((item?.price || 0) * (item?.quantity || 0)))}`}</td>
                                                                    <td>
                                                                        <button className="btn text-danger btn-sm btn-icon" type="button" onClick={() => { cancelOrder(item?._id) }}><i className="ri-delete-bin-6-line pr-0"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                    ) : (
                                                        <tr className="no-data-row spot_orders_no_data_row">
                                                            <td colSpan={10}>
                                                                <div className="spot_orders_empty_state" role="status">
                                                                    <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                                                    {/* <p className="spot_orders_empty_caption">No data</p> */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>

                                    <div className='order_history_mobile_view twomobile'>
                                        <div className='d-flex datalist_mbl'>
                                            {openOrders?.length > 0 ? (
                                                openOrders
                                                    .filter((item) => orderType === item?.side || orderType === 'All')
                                                    .map((item, index) => (
                                                        <div key={item?._id || index} className='order_datalist'>
                                                            <ul className='listdata'>
                                                                <li>
                                                                    <span className='date'>Date</span>
                                                                    <span className='date_light'>{moment(item?.updatedAt).format("DD/MM/YYYY")}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Time</span>
                                                                    <span>{moment(item?.updatedAt).format("hh:mm")}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Currency Pair</span>
                                                                    <span>{SelectedCoin?.base_currency}/{SelectedCoin?.quote_currency}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Type</span>
                                                                    <span>{item?.order_type}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Side</span>
                                                                    <span>{item?.side}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Price</span>
                                                                    <span>{item?.price?.toFixed(8)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Amount</span>
                                                                    <span>{item?.quantity?.toFixed(8)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Remaining</span>
                                                                    <span>{item?.remaining?.toFixed(8)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Filled</span>
                                                                    <span>{item?.filled?.toFixed(8)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Total</span>
                                                                    <span>{(item?.price * item?.quantity)?.toFixed(8)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Action</span>
                                                                    <span>
                                                                        <button className="btn text-danger btn-sm btn-icon p-0" type="button" onClick={() => cancelOrder(item?._id)}>
                                                                            <i className="ri-delete-bin-6-line pr-0"></i>
                                                                        </button>
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="no-data-wrapper w-100">
                                                    <div className="spot_orders_empty_state" role="status">
                                                        <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                                        {/* <p className="spot_orders_empty_caption">No data</p> */}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                <div className={`cnt_table tradeHistory ${positionOrderTab === "tradeHistory" ? "active" : ""}`}>
                                    <div className="desktop_view2">
                                        <div className="table-responsive spot_orders_table_wrap spot_orders_placeholder_shell">
                                            <div className="spot_orders_empty_state" role="status">
                                                <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                                {/* <p className="spot_orders_empty_caption">No data</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`cnt_table loan ${positionOrderTab === "loan" ? "active" : ""}`}>
                                    <div className="desktop_view2">
                                        <div className="table-responsive spot_orders_table_wrap spot_orders_placeholder_shell">
                                            <div className="spot_orders_empty_state" role="status">
                                                <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                                {/* <p className="spot_orders_empty_caption">No data</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`cnt_table bots ${positionOrderTab === "bots" ? "active" : ""}`}>
                                    <div className="desktop_view2">
                                        <div className="table-responsive spot_orders_table_wrap spot_orders_placeholder_shell">
                                            <div className="spot_orders_empty_state" role="status">
                                                <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                                {/* <p className="spot_orders_empty_caption">No data</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`cnt_table orderHistory ${positionOrderTab === "orderHistory" ? "active" : ""}`}>

                                    <div className="desktop_view2">
                                        <div className="table-responsive" style={{ height: '353px' }} >
                                            <table className="table table_home ">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Trading Pair</th>
                                                        <th> <div className="num-div justify-content-start">
                                                            <select className=" form-select num-select p-0 input-select cursor-pointer" value={pastOrderType} onChange={(e) => { setpastOrderType(e.target.value) }}>
                                                                <option value="All">All</option>
                                                                <option value="BUY">Buy</option>
                                                                <option value="SELL">Sell</option>
                                                            </select>
                                                        </div></th>
                                                        <th>Price</th>
                                                        <th>Average</th>
                                                        <th>Quantity</th>
                                                        <th>Remaining</th>
                                                        <th>Total</th>
                                                        <th>Fee</th>
                                                        <th>Order Type</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pastOrders?.length > 0 ? pastOrders.map((item, index) =>
                                                        (item?.side === pastOrderType || pastOrderType === "All") &&
                                                        <>
                                                            <tr key={index} onClick={() => setExpandedRowIndex(expandedRowIndex === index ? null : index)} className="cursor-pointer">
                                                                <td>

                                                                    <div className="c_view justify-content-start">
                                                                        {item?.executed_prices?.length > 0 && (
                                                                            <p className="ms-2 mx-2 text-xl d-inline text-success">{expandedRowIndex === index ? '▾' : '▸'}</p>
                                                                        )}
                                                                        <span>{moment(item?.updatedAt).format("DD/MM/YYYY")}{" "}
                                                                            <small>{moment(item?.updatedAt).format("hh:mm")}</small>
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td>{item?.side === "BUY" ? `${item?.ask_currency}/${item?.pay_currency}` : `${item?.pay_currency}/${item?.ask_currency}`}</td>
                                                                <td>{item?.side}</td>
                                                                <td>{nineDecimalFormat(item?.price)}</td>
                                                                <td>{nineDecimalFormat(item?.avg_execution_price)}</td>
                                                                <td>{nineDecimalFormat(item?.quantity)}</td>
                                                                <td>{nineDecimalFormat(item?.remaining)}</td>
                                                                <td>{nineDecimalFormat(item?.quantity * item?.avg_execution_price)}</td>
                                                                <td>{nineDecimalFormat(item?.total_fee)} {item?.ask_currency}</td>
                                                                <td>{item?.order_type}</td>
                                                                <td className={`text-${item?.status === "FILLED" ? "success" : item?.status === "CANCELLED" ? "danger" : "warning"}`}>
                                                                    {item?.status === 'FILLED' ? 'EXECUTED' : item?.status}

                                                                </td>
                                                            </tr>

                                                            {/* Sub-row for executed trades */}
                                                            {expandedRowIndex === index && item?.executed_prices?.length > 0 && (
                                                                <tr>
                                                                    <td colSpan={12}>
                                                                        <div className='table-responsive bg-dark'>
                                                                            <table className="table table_home   ">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>#</th>
                                                                                        <th>Trading price	</th>
                                                                                        <th>Executed</th>
                                                                                        <th>Trading Fee</th>
                                                                                        <th>Total</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {item.executed_prices.map((trade: any, i: number) => (
                                                                                        <tr key={i}>
                                                                                            <td>{i + 1}</td>
                                                                                            <td >{nineDecimalFormat(trade.price)} {item?.side === "BUY" ? `${item?.pay_currency}` : `${item?.ask_currency}`}</td>
                                                                                            <td>{nineDecimalFormat(trade.quantity)} {item?.side === "BUY" ? `${item?.ask_currency}` : `${item?.pay_currency}`}</td>
                                                                                            <td>{nineDecimalFormat(+trade.fee)} {item?.ask_currency}</td>
                                                                                            <td>{nineDecimalFormat(+trade.price * trade.quantity)}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </>

                                                    ) : <tr className="no-data-row spot_orders_no_data_row">
                                                        <td colSpan={12}>
                                                            <div className="spot_orders_empty_state" role="status">
                                                                <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                                                {/* <p className="spot_orders_empty_caption">No data</p> */}
                                                            </div>
                                                        </td>
                                                    </tr>}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                    <div className='order_history_mobile_view twomobile'>
                                        <div className='d-flex datalist_mbl'>
                                            {pastOrders?.length > 0 ? (
                                                pastOrders
                                                    .filter((item) => item?.side === pastOrderType || pastOrderType === 'All')
                                                    .map((item, index) => (
                                                        <div key={item?._id || index} className='order_datalist'>
                                                            <ul className='listdata'>
                                                                <li>
                                                                    <span className='date'>Date</span>
                                                                    <span className='date_light'>{moment(item?.updatedAt).format("DD/MM/YYYY")}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Time</span>
                                                                    <span>{moment(item?.updatedAt).format("hh:mm")}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Currency Pair</span>
                                                                    <span>{item?.side === "BUY" ? `${item?.ask_currency}/${item?.pay_currency}` : `${item?.pay_currency}/${item?.ask_currency}`}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Side</span>
                                                                    <span>{item?.side}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Price</span>
                                                                    <span>{nineDecimalFormat(item?.price)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Average</span>
                                                                    <span>{nineDecimalFormat(item?.avg_execution_price)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Quantity</span>
                                                                    <span>{nineDecimalFormat(item?.quantity)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Remaining</span>
                                                                    <span>{nineDecimalFormat(item?.remaining)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Total</span>
                                                                    <span>{nineDecimalFormat(item?.quantity * item?.avg_execution_price)}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Fee</span>
                                                                    <span>{nineDecimalFormat(item?.total_fee)} {item?.ask_currency}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Order Type</span>
                                                                    <span>{item?.order_type}</span>
                                                                </li>
                                                                <li>
                                                                    <span>Status</span>
                                                                    <span className={`text-${item?.status === "FILLED" ? "success" : item?.status === "CANCELLED" ? "danger" : "warning"}`}>
                                                                        {item?.status === 'FILLED' ? 'EXECUTED' : item?.status}
                                                                    </span>
                                                                </li>
                                                            </ul>

                                                            {item?.executed_prices?.length > 0 && (
                                                                <div className={`executed_trades_list ${showExecutedTrades[item?._id] ? 'active' : ''}`}>
                                                                    <button onClick={() => setShowExecutedTrades({ ...showExecutedTrades, [item?._id]: !showExecutedTrades[item?._id] })}>
                                                                        <i className={`ri-arrow-drop-down-line ${showExecutedTrades[item?._id] ? 'rotated' : ''}`}></i>Executed Trades
                                                                    </button>
                                                                    {showExecutedTrades[item?._id] && (
                                                                        <div className='executed_trades_list_items'>
                                                                            {item.executed_prices.map((trade: any, i: number) => (
                                                                                <ul key={i}>
                                                                                    <li>Trade #{i + 1}:</li>
                                                                                    <li>Trading Price: <span>{nineDecimalFormat(trade.price)} {item?.side === "BUY" ? item?.pay_currency : item?.ask_currency}</span></li>
                                                                                    <li>Executed: <span>{nineDecimalFormat(trade.quantity)} {item?.side === "BUY" ? item?.ask_currency : item?.pay_currency}</span></li>
                                                                                    <li>Trading Fee: <span>{nineDecimalFormat(+trade.fee)} {item?.ask_currency}</span></li>
                                                                                    <li>Total: <span>{nineDecimalFormat(+trade.price * trade.quantity)}</span></li>
                                                                                </ul>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="no-data-wrapper w-100 d-flex justify-content-center py-4">
                                                    <div className="spot_orders_empty_state" role="status">
                                                        <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                                        {/* <p className="spot_orders_empty_caption">No data</p> */}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                </div>

                            </div>

                            <div className="assets_right d-none d-lg-block assets_panel_desktop">
                                <div id="tab_4" className="assets_panel_inner">
                                    <div className="assets_panel_header">
                                        <h5 className="assets_panel_title">Assets</h5>
                                        <button type="button" className="assets_panel_refresh" onClick={() => fetchSpotWallets()} aria-label="Refresh balances">
                                            <i className="ri-refresh-line" />
                                        </button>
                                    </div>

                                    <div className="assets_balance_rows">
                                        <div className="assets_balance_row">
                                            <span className="assets_balance_label">{SelectedCoin?.quote_currency || "USDT"} Balance</span>
                                            <span className="assets_balance_val">
                                                {token
                                                    ? `${BuyCoinBal !== undefined && BuyCoinBal !== null ? Number(BuyCoinBal).toFixed(8).replace(/\.?0+$/, "") : "0"} ${SelectedCoin?.quote_currency || "USDT"}`
                                                    : `-- ${SelectedCoin?.quote_currency || "USDT"}`}
                                            </span>
                                        </div>
                                        <div className="assets_balance_row">
                                            <span className="assets_balance_label">{SelectedCoin?.base_currency || "BTC"} Balance</span>
                                            <span className="assets_balance_val">
                                                {token
                                                    ? `${SellCoinBal !== undefined && SellCoinBal !== null ? Number(SellCoinBal).toFixed(8).replace(/\.?0+$/, "") : "0"} ${SelectedCoin?.base_currency || "BTC"}`
                                                    : `-- ${SelectedCoin?.base_currency || "BTC"}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="assets_panel_actions">
                                        <Link className="assets_panel_pill" to={token ? "/asset_managemnet/deposit" : "/login"}>
                                            Deposit
                                        </Link>
                                        <Link className="assets_panel_pill" to={token ? "/user_profile/swap" : "/login"}>
                                            Convert
                                        </Link>
                                        <Link className="assets_panel_pill" to={token ? "/user_profile/asset_overview" : "/login"}>
                                            Transfer
                                        </Link>
                                    </div>

                                    <div className="assets_panel_list_card">
                                        {!token ? (
                                            <div className="assets_panel_login_hint">
                                                <p className="assets_panel_login_text mb-2">Please login to view your wallets</p>
                                                <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                                            </div>
                                        ) : walletsLoading ? (
                                            <div className="assets_panel_loading">
                                                <div className="spinner-border text-primary" role="status" style={{ width: "1.5rem", height: "1.5rem" }} />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="assets_panel_list_head">
                                                    <span>Asset</span>
                                                    <span>Balance</span>
                                                </div>
                                                <ul className="assets_panel_asset_rows">
                                                    {spotWallets?.length > 0 ? (
                                                        spotWallets.map((wallet, index) => (
                                                            <li key={wallet?._id || index} className="assets_panel_asset_row">
                                                                <div className="assets_panel_asset_left">
                                                                    <img
                                                                        src={wallet?.icon_path}
                                                                        alt={wallet?.short_name || ""}
                                                                        width="32"
                                                                        height="32"
                                                                        className="assets_panel_coin_icon"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = "/images/coin_placeholder.png";
                                                                        }}
                                                                    />
                                                                    <div className="assets_panel_asset_meta">
                                                                        <span className="assets_panel_sym">{wallet?.short_name}</span>
                                                                        <span className="assets_panel_full">{wallet?.full_name || wallet?.short_name}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="assets_panel_bal">
                                                                    {parseFloat((wallet?.balance || 0).toFixed(8))}
                                                                </span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="assets_panel_empty">
                                                            <span className="text-muted">No assets in spot wallet</span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>
            </div >

            {/* Mobile Favourites Popup */}
            {showMobileFavouritesPopup && (
                <div className="mobile-favourites-popup-overlay" onClick={() => setShowMobileFavouritesPopup(false)}>
                    <div className="mobile-favourites-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-favourites-popup-header">
                            <h4>Select Pair</h4>
                            <button className="mobile-favourites-close-btn" onClick={() => setShowMobileFavouritesPopup(false)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="mobile-favourites-popup-content">
                            <div className="spotLists">
                                {/* Search */}
                                <div className="spot-list-search">
                                    <div className="ivu-input">
                                        <i className="ri-search-2-line"></i>
                                        <input
                                            autoComplete="off"
                                            spellCheck="false"
                                            type="search"
                                            placeholder="Search"
                                            onChange={(e) => setsearch(e.target.value)}
                                            value={search}
                                        />
                                    </div>
                                </div>

                                <ul className="favorites_list_tabs">
                                    {token && (
                                        <li>
                                            <button
                                                className={coinFilter === 'FAV' ? 'active' : ''}
                                                onClick={() => setcoinFilter('FAV')}
                                            >
                                                Favourites
                                            </button>
                                        </li>
                                    )}
                                    {CoinPairDetails && [...new Set(CoinPairDetails.map(item => item?.quote_currency)), "BTC", "BNB", "ETH"].map((quoteCurrency, idx) => (
                                        <li key={idx}>
                                            <button
                                                className={coinFilter === quoteCurrency ? 'active' : ''}
                                                onClick={() => setcoinFilter(quoteCurrency)}
                                            >
                                                {quoteCurrency}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Table */}
                                <div className="price_card table-responsive">
                                    <table className="table table-sm table-borderless mb-0 orderbook-table">
                                        <thead>
                                            <tr>
                                                <th>Pair</th>
                                                <th className="text-end">Price</th>
                                                <th className="text-end">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody className="price_card_body">
                                            {CoinPairDetails &&
                                                CoinPairDetails.map((data, index) => {
                                                    // Filter by favorites
                                                    if (coinFilter === "FAV" && !favCoins.includes(data?._id)) {
                                                        return null;
                                                    }
                                                    // Filter by quote currency
                                                    if (coinFilter !== "FAV" && (data?.quote_currency !== coinFilter && data?.base_currency !== coinFilter)) {
                                                        return null;
                                                    }

                                                    const isActive =
                                                        SelectedCoin?.base_currency === data?.base_currency &&
                                                        SelectedCoin?.quote_currency === data?.quote_currency;

                                                    return (
                                                        <tr
                                                            key={index}
                                                            className={isActive ? "active" : ""}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                handleSelectCoin(data);
                                                                setShowMobileFavouritesPopup(false);
                                                            }}
                                                        >
                                                            {/* Pair */}
                                                            <td>
                                                                <div className="d-flex align-items-center gap-1">
                                                                    <img
                                                                        src={data?.icon_path}
                                                                        alt=""
                                                                        className="img-fluid me-1 round_img"
                                                                    />
                                                                    <div className="d-flex flex-column">
                                                                        {`${data?.base_currency}/${data?.quote_currency}`}
                                                                        <span className="tokensubcnt">{data?.base_currency_fullname}</span>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Price */}
                                                            <td className="text-end">
                                                                <div className="d-flex flex-column">
                                                                    <span>{data?.buy_price}</span>
                                                                    <span className="tokensubcnt">${data?.buy_price}</span>
                                                                </div>
                                                            </td>

                                                            {/* Change + Star */}
                                                            <td className="text-end">
                                                                <div className="d-flex justify-content-end align-items-center gap-2">
                                                                    <div className="d-flex flex-column text-end">
                                                                        <span
                                                                            className={
                                                                                data?.change_percentage >= 0
                                                                                    ? "text-green"
                                                                                    : "text-danger"
                                                                            }
                                                                        >
                                                                            {data?.change_percentage >= 0 ? `+${Number(parseFloat(data?.change_percentage)?.toFixed(5))}` : Number(parseFloat(data?.change_percentage)?.toFixed(5))}%
                                                                        </span>
                                                                        <span className="tokensubcnt">{parseFloat(data?.change?.toFixed(5)) || 0}</span>
                                                                    </div>

                                                                    {token && (
                                                                        <i
                                                                            className={
                                                                                favCoins.includes(data?._id)
                                                                                    ? "ri ri-star-fill ri-xl"
                                                                                    : "ri ri-star-line ri-xl"
                                                                            }
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleAddFav(data?._id);
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Trade
