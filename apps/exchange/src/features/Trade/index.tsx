import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { alertErrorMessage, alertSuccessMessage } from "./CustomAlertMessage";
import TVChartContainer from "./Libraries/TVChartContainer/index.jsx";
import '../TradePage/trade_new.css'
import { ProfileContext } from "../../context/ProfileProvider.js";
import { usePlatformStatus } from "../../context/PlatformStatusProvider.js";
import { SocketContext } from "./SocketContext.js";
import { Helmet } from "react-helmet-async";
import { AssetsPanel } from "./components/AssetsPanel/AssetsPanel.js";
import { InlineOrderBookCard } from "./components/OrderBook/InlineOrderBookCard.js";
import { TokenInfoTab } from "./components/TokenInfoTab/TokenInfoTab.js";
import { MobileTradeHistory } from "./components/MobileTradeHistory/MobileTradeHistory.js";
import { MobileWalletsPanel } from "./components/MobileWalletsPanel/MobileWalletsPanel.js";
import { ordersApi, type PlaceOrderPayload } from "../../lib/matching-api.js";
import { useAuth } from "../../providers/AuthProvider.js";
import { useOrderForm } from "./hooks/useOrderForm.js";
import { useOrderBookDepth } from "./hooks/useOrderBookDepth.js";
import { useMarketData } from "./hooks/useMarketData.js";
import { useMyOrders } from "./hooks/useMyOrders.js";
import { useSpotWallets } from "./hooks/useSpotWallets.js";
import { usePairBalance } from "./hooks/usePairBalance.js";
import { useOrderBookUI } from "./hooks/useOrderBookUI.js";
import { useCoinList } from "./hooks/useCoinList.js";
import { OrderForm } from "./components/OrderForm/index.js";
import { OrderBookPanel } from "./components/OrderBook/OrderBookPanel.js";
import { MarketHeader } from "./components/MarketHeader/MarketHeader.js";
import { CoinListPanel } from "./components/CoinList/CoinListPanel.js";
import { SpotOrdersPanel } from "./components/SpotOrders/SpotOrdersPanel.js";
import {
    formatQuantity as fmtQtyUtil,
    formatPriceThousands as fmtPriceThousandsUtil,
} from "./utils/formatting.js";
import { toErrorMessage } from "./utils/errorMessage.js";
import { useTradeUIStore } from "./stores/tradeUIStore.js";
import { useWalletsStore } from "./stores/walletsStore.js";

const Trade = () => {
    const { getStatus } = usePlatformStatus();
    const isSpotDisabled = !getStatus('spot_trading').enabled;
    const { isAuthenticated, user } = useAuth();
    const currentUserId = user?.userId ?? user?.id ?? null;
    const token = isAuthenticated ? '1' : null;
    const navigate = useNavigate();
    const { trade: tradeParam } = useParams<{ trade?: string }>();
    const { getSocket, isConnected } = useContext(SocketContext);
    const { userDetails } = useContext(ProfileContext);
    const KycStatus = userDetails?.kycVerified;

    // UI-only state (Zustand)
    const {
        SelectedCoin, setSelectedCoin,
        desAndLinks, setDesAndLinks,
        showTab, setShowTab,
        showMobileFavouritesPopup, setShowMobileFavouritesPopup,
        isFavouritesOpen, setIsFavouritesOpen,
        expandedRowIndex, setExpandedRowIndex,
        positionOrderTab, setPositionOrderTab,
        openOrderKindTab, setOpenOrderKindTab,
        showExecutedTrades, setShowExecutedTrades,
    } = useTradeUIStore();

    // Coin search / filter / favourites
    const {
        search, setsearch,
        AllData,
        CoinPairDetails, coinFilter, setcoinFilter,
        favCoins, handleAddFav,
    } = useCoinList();

    // Order book UI state + agg-dropdown close effect
    const {
        orderBookActiveTab, setOrderBookActiveTab,
        orderBookViewMode, setOrderBookViewMode,
        orderBookAggStep, setOrderBookAggStep,
        orderBookAggOpen, setOrderBookAggOpen,
        orderBookSwapAmountTotal, setOrderBookSwapAmountTotal,
    } = useOrderBookUI();

    // Full wallet list for the AssetsPanel / MobileWalletsPanel — /wallet/balances.
    const { spotWallets, walletsLoading, fetchSpotWallets } = useSpotWallets();

    const { BuyCoinBal, SellCoinBal } = useWalletsStore();

    // Open + past orders with cancel / refresh
    const {
        openOrders, pastOrders,
        orderType, setorderType,
        pastOrderType, setpastOrderType,
        cancelOrder, refreshMyOrders,
    } = useMyOrders(isAuthenticated);

    // Market-data: REST polling + socket subscriptions + derived price stats.
    const {
        BuyOrders, setBuyOrders,
        SellOrders, setSellOrders,
        RecentTrade, setRecentTrade,
        loader,
        buyprice, setbuyprice,
        sellPrice, setsellPrice,
        priceChange, setpriceChange,
        changesHour, setChangesHour,
        priceHigh, setpriceHigh,
        priceLow, setpriceLow,
        volume, setvolume,
        isPricePositive, setIsPricePositive,
    } = useMarketData(SelectedCoin, getSocket, isConnected, currentUserId, () => {
        // Invoked when a local:trade event involves the current user.
        refreshMyOrders();
        fetchSpotWallets();
        refreshPairBalanceRef.current();
    });

    // Holds the latest refreshPairBalance — lets us invoke it from callbacks
    // declared BEFORE usePairBalance() runs (useMarketData's onUserTrade).
    const refreshPairBalanceRef = useRef<() => void>(() => {});

    // Order-form state (tabs/mode/inputs/sliders/FOK-IOC/slippage + their handlers).
    const form = useOrderForm({ SelectedCoin, BuyCoinBal, SellCoinBal, buyprice, sellPrice });
    const {
        infoPlaceOrder,
        showBuySellTab, setShowBuySellTab,
        buyOrderPrice, setbuyOrderPrice, buyamount,
        sellOrderPrice, setsellOrderPrice, sellAmount,
        buyStopPrice, sellStopPrice,
        limitBuyFok, limitBuyIoc, limitSellFok, limitSellIoc,
        validateOrder, resetForm, fillFromAskRow, fillFromBidRow,
    } = form;

    const formatQuantity = (q: any) => fmtQtyUtil(q, SelectedCoin);
    const formatPriceThousands = (r: any) => fmtPriceThousandsUtil(r, SelectedCoin);

    // Derive SelectedCoin from the URL param (e.g. /trade/BTC_USDT).
    useEffect(() => {
        const raw = tradeParam || 'BTC_USDT';
        const [base, quote] = raw.split('_');
        if (!base || !quote) return;
        setSelectedCoin({ base_currency: base, quote_currency: quote });
    }, [tradeParam]);

    // Sync pair metadata + ticker stats from AllData whenever it loads or the
    // selected pair changes. Looks up by base/quote currency codes so it works
    // for both URL-initialised coins (no _id) and pair-list selected coins.
    useEffect(() => {
        if (!AllData?.pairs || !SelectedCoin) return;
        const pair = AllData.pairs.find((item: any) =>
            item?.base_currency === SelectedCoin?.base_currency &&
            item?.quote_currency === SelectedCoin?.quote_currency
        );
        if (!pair) return;
        // Enrich SelectedCoin with full metadata (tick_size, step_size, icon, etc.)
        setSelectedCoin({ ...pair });
        setDesAndLinks({ description: pair.description ?? "", links: [] });
        setIsPricePositive(pair.buy_price >= buyprice);
        setbuyprice(pair.buy_price);
        setsellPrice(pair.sell_price);
        setpriceChange(pair.change_percentage);
        setChangesHour(pair.change);
        setpriceHigh(pair.high);
        setpriceLow(pair.low);
        setvolume(pair.volume);
    }, [AllData, SelectedCoin?.base_currency, SelectedCoin?.quote_currency]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Refresh user-specific snapshots whenever the socket (re)connects.
    // User channels (user:order:*, user:balance:*) aren't implemented yet,
    // so events may have been missed during the disconnect — pull fresh REST.
    useEffect(() => {
        if (!isAuthenticated) return;
        if (!isConnected) return;
        refreshMyOrders();
        fetchSpotWallets();
        refreshPairBalanceRef.current();
    }, [isAuthenticated, isConnected]);

    // Order-form "Available" / "Max" — per-asset fetch via /wallet/balances/:asset.
    // Buy tab → quote balance, Sell tab → base balance. Auto-refreshes on pair
    // or tab change. Manual refresh via refreshPairBalance (after place/cancel).
    const { refreshPairBalance } = usePairBalance(SelectedCoin, showBuySellTab);
    useEffect(() => { refreshPairBalanceRef.current = refreshPairBalance; }, [refreshPairBalance]);

    // Reset orderbook state when the user switches pairs.
    const resetOrderbook = () => {
        setSellOrders([]);
        setBuyOrders([]);
        setRecentTrade([]);
        setOrderBookViewMode("both");
        setOrderBookSwapAmountTotal(false);
    };

    const handleSelectCoin = (data: any) => {
        if (
            SelectedCoin?.base_currency_id === data?.base_currency_id &&
            SelectedCoin?.quote_currency_id === data?.quote_currency_id
        ) return;

        resetOrderbook();
        resetForm();
        navigate(`/trade/${data?.base_currency}_${data?.quote_currency}`);
        setSelectedCoin(data);
        setbuyprice(data?.buy_price);
        setsellPrice(data?.sell_price);
        setExpandedRowIndex(null);
        setDesAndLinks({ description: data?.description ?? "", links: [] });
    };

    const handleOrderPlace = async (
        orderType: string,
        orderPrice: any,
        orderAmount: any,
        _base_currency_id: string,
        _quote_currency_id: string,
        side: string,
    ) => {
        if (!validateOrder(orderPrice, orderAmount, side)) return;
        if (!isAuthenticated) {
            alertErrorMessage('Please login to place orders.');
            return;
        }
        if (!SelectedCoin?.base_currency || !SelectedCoin?.quote_currency) {
            alertErrorMessage('No pair selected.');
            return;
        }

        const symbol = `${SelectedCoin.base_currency}-${SelectedCoin.quote_currency}`;
        const type = orderType as PlaceOrderPayload['type'];
        const isLimitFamily = type === 'LIMIT' || type === 'STOP_LIMIT';
        const isBuy = side === 'BUY';
        const fok = isBuy ? limitBuyFok : limitSellFok;
        const ioc = isBuy ? limitBuyIoc : limitSellIoc;
        // Default GTC; FOK > IOC toggles only apply to LIMIT orders. MARKET is IOC by spec.
        let timeInForce: PlaceOrderPayload['timeInForce'] = 'GTC';
        if (!isLimitFamily) timeInForce = 'IOC';
        else if (fok) timeInForce = 'FOK';
        else if (ioc) timeInForce = 'IOC';

        const payload: PlaceOrderPayload = {
            symbol,
            side: side as PlaceOrderPayload['side'],
            type,
            timeInForce,
            quantity: String(orderAmount),
        };
        if (isLimitFamily) payload.price = String(orderPrice);
        if (type === 'STOP_LIMIT' || type === 'STOP_MARKET') {
            const stop = isBuy ? buyStopPrice : sellStopPrice;
            if (stop) payload.stopPrice = String(stop);
        }

        try {
            const placed = await ordersApi.place(payload);
            const label = `${side} ${type} ${payload.quantity}${payload.price ? ` @ ${payload.price}` : ''}`;
            alertSuccessMessage(`${label} — ${placed.status || 'placed'}${placed.orderId ? ` (${placed.orderId.slice(0, 8)})` : ''}`);
            setbuyOrderPrice('');
            setsellOrderPrice('');
            refreshMyOrders();
            fetchSpotWallets();
            refreshPairBalance();
        } catch (err) {
            alertErrorMessage(toErrorMessage(err, 'Order failed'));
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        await cancelOrder(orderId);
        fetchSpotWallets();
        refreshPairBalance();
    };

    const depth = useOrderBookDepth(BuyOrders, SellOrders, orderBookAggStep);

    return (
        <>
            <Helmet>
                <title>{`${SelectedCoin?.base_currency || "BTC"}/${SelectedCoin?.quote_currency || "USDT"} Spot Trading – AGCE`}</title>
                <meta name="description" content="Trade Bitcoin against USDT on AGCE with intuitive interface, live market data and safety features. Register today." />
                <meta name="keywords" content="spot bitcoin usdt, trade bitcoin exchange, AGCE spot trading, BTC USDT AGCE" />
            </Helmet>

            <div className="trade-wrapper spot pb-3">
                <div className="container-fluid">
                    <div className="row g-1 g-md-2">

                        <div className={`col-12 col-lg-12 col-xl-2 col-xxl-2 trade_favourites_lft ${isFavouritesOpen ? "is-open" : "is-collapsed"}`}>
                            <CoinListPanel
                                CoinPairDetails={CoinPairDetails}
                                coinFilter={coinFilter}
                                setcoinFilter={setcoinFilter}
                                favCoins={favCoins}
                                SelectedCoin={SelectedCoin}
                                search={search}
                                setsearch={setsearch}
                                token={token}
                                onSelectCoin={handleSelectCoin}
                                onToggleFav={handleAddFav}
                            />
                        </div>

                        <div className="col-12 col-lg-12 col-xl-7 col-xxl-7 midgraph_col">
                            <MarketHeader
                                SelectedCoin={SelectedCoin}
                                buyprice={buyprice}
                                isPricePositive={isPricePositive}
                                priceChange={priceChange}
                                changesHour={changesHour}
                                priceHigh={priceHigh}
                                priceLow={priceLow}
                                volume={volume}
                                onPairClick={() => {
                                    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 991px)").matches) {
                                        setShowMobileFavouritesPopup(true);
                                        return;
                                    }
                                    setIsFavouritesOpen((v) => !v);
                                }}
                            />

                            <div className="trade_card trade_chart p-0">
                                <div className="treade_card_header tch_main_tab">
                                    <div className={`card_header_title cursor-pointer ${showTab === "chart" && "active"}`} onClick={() => setShowTab("chart")}>Chart</div>
                                    <div className={`card_header_title cursor-pointer ${showTab === "token_info" && "active"}`} onClick={() => setShowTab("token_info")}>Info</div>
                                    <div className={`card_header_title cursor-pointer d-lg-none ${showTab === "order_book" && "active"}`} onClick={() => setShowTab("order_book")}>Order Book</div>
                                    <div className={`card_header_title cursor-pointer d-lg-none ${showTab === "trade_history" && "active"}`} onClick={() => setShowTab("trade_history")}>Market Trades</div>
                                    <div className={`card_header_title cursor-pointer d-lg-none ${showTab === "wallets" && "active"}`} onClick={() => setShowTab("wallets")}>Wallets</div>
                                </div>
                                <div id="tab_1" className={`cc_tab ${showTab !== "chart" && "d-none"}`}>
                                    <TVChartContainer symbol={SelectedCoin?.base_currency && SelectedCoin?.quote_currency ? `${SelectedCoin.base_currency}/${SelectedCoin.quote_currency}` : ''} />
                                </div>
                                <div id="tab_2" className={`cc_tab ${showTab !== "token_info" && "d-none"}`}>
                                    <TokenInfoTab SelectedCoin={SelectedCoin} desAndLinks={desAndLinks} />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-12 col-xl-5 col-xxl-5 mmn_btm_minus_spc">
                            <div className="row g-1 g-md-2 px-1 px-md-0">
                                <div className="col-lg-6">
                                    <InlineOrderBookCard
                                        depth={depth}
                                        SelectedCoin={SelectedCoin}
                                        orderBookActiveTab={orderBookActiveTab}
                                        setOrderBookActiveTab={setOrderBookActiveTab}
                                        orderBookViewMode={orderBookViewMode}
                                        setOrderBookViewMode={setOrderBookViewMode}
                                        orderBookAggStep={orderBookAggStep}
                                        setOrderBookAggStep={setOrderBookAggStep}
                                        orderBookAggOpen={orderBookAggOpen}
                                        setOrderBookAggOpen={setOrderBookAggOpen}
                                        orderBookSwapAmountTotal={orderBookSwapAmountTotal}
                                        setOrderBookSwapAmountTotal={setOrderBookSwapAmountTotal}
                                        loader={loader}
                                        buyprice={buyprice}
                                        isPricePositive={isPricePositive}
                                        priceChange={priceChange}
                                        RecentTrade={RecentTrade}
                                        showTab={showTab}
                                        formatPriceThousands={formatPriceThousands}
                                        formatQuantity={formatQuantity}
                                        onAskRowClick={fillFromAskRow}
                                        onBidRowClick={fillFromBidRow}
                                    />
                                </div>

                                <MobileTradeHistory SelectedCoin={SelectedCoin} RecentTrade={RecentTrade} showTab={showTab} />

                                <MobileWalletsPanel
                                    showTab={showTab}
                                    token={token}
                                    spotWallets={spotWallets}
                                    walletsLoading={walletsLoading}
                                    onRefresh={fetchSpotWallets}
                                />

                                <div className="col-lg-6">
                                    <div className="bs_tab_row d-lg-none">
                                        <div className="row gx-3">
                                            <div className="col-6">
                                                <button className="btn btn-success btn-block w-100" onClick={() => setShowBuySellTab("buy")}>
                                                    <span>Buy</span>
                                                </button>
                                            </div>
                                            <div className="col-6">
                                                <button className="btn btn-danger btn-block w-100" onClick={() => setShowBuySellTab("sell")}>
                                                    <span>Sell</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`bs_dropbox d-lg-block ${!showBuySellTab && "d-none"}`}>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="d-flex bottm_lightbox_two">
                                                    <OrderBookPanel
                                                        depth={depth}
                                                        SelectedCoin={SelectedCoin}
                                                        buyprice={buyprice}
                                                        priceChange={priceChange}
                                                        isPricePositive={isPricePositive}
                                                        loader={loader}
                                                        orderBookViewMode={orderBookViewMode}
                                                        setOrderBookViewMode={setOrderBookViewMode}
                                                        orderBookAggStep={orderBookAggStep}
                                                        setOrderBookAggStep={setOrderBookAggStep}
                                                        orderBookAggOpen={orderBookAggOpen}
                                                        setOrderBookAggOpen={setOrderBookAggOpen}
                                                        orderBookSwapAmountTotal={orderBookSwapAmountTotal}
                                                        setOrderBookSwapAmountTotal={setOrderBookSwapAmountTotal}
                                                        formatPriceThousands={formatPriceThousands}
                                                        formatQuantity={formatQuantity}
                                                        onAskRowClick={fillFromAskRow}
                                                        onBidRowClick={fillFromBidRow}
                                                        showTab={showTab}
                                                    />
                                                    <OrderForm
                                                        form={form}
                                                        SelectedCoin={SelectedCoin}
                                                        BuyCoinBal={BuyCoinBal}
                                                        SellCoinBal={SellCoinBal}
                                                        buyprice={buyprice}
                                                        sellPrice={sellPrice}
                                                        token={token}
                                                        KycStatus={KycStatus}
                                                        isSpotDisabled={isSpotDisabled}
                                                        onBuy={() => handleOrderPlace(infoPlaceOrder, buyOrderPrice !== '' && buyOrderPrice ? buyOrderPrice : buyprice, buyamount, SelectedCoin?.base_currency_id, SelectedCoin?.quote_currency_id, 'BUY')}
                                                        onSell={() => handleOrderPlace(infoPlaceOrder, sellOrderPrice !== '' && sellOrderPrice ? sellOrderPrice : sellPrice, sellAmount, SelectedCoin?.base_currency_id, SelectedCoin?.quote_currency_id, 'SELL')}
                                                        onLoginRedirect={() => navigate('/login')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="trade_account_summary_assets">
                            <SpotOrdersPanel
                                openOrders={openOrders}
                                pastOrders={pastOrders}
                                positionOrderTab={positionOrderTab}
                                setPositionOrderTab={setPositionOrderTab}
                                openOrderKindTab={openOrderKindTab}
                                setOpenOrderKindTab={setOpenOrderKindTab}
                                orderType={orderType}
                                setorderType={setorderType}
                                pastOrderType={pastOrderType}
                                setpastOrderType={setpastOrderType}
                                expandedRowIndex={expandedRowIndex}
                                setExpandedRowIndex={setExpandedRowIndex}
                                showExecutedTrades={showExecutedTrades}
                                setShowExecutedTrades={setShowExecutedTrades}
                                SelectedCoin={SelectedCoin}
                                onCancelOrder={handleCancelOrder}
                            />
                            <AssetsPanel
                                SelectedCoin={SelectedCoin}
                                BuyCoinBal={BuyCoinBal}
                                SellCoinBal={SellCoinBal}
                                token={token}
                                spotWallets={spotWallets}
                                walletsLoading={walletsLoading}
                                onRefresh={fetchSpotWallets}
                            />
                        </div>

                    </div>
                </div>
            </div>

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
                            <CoinListPanel
                                CoinPairDetails={CoinPairDetails}
                                coinFilter={coinFilter}
                                setcoinFilter={setcoinFilter}
                                favCoins={favCoins}
                                SelectedCoin={SelectedCoin}
                                search={search}
                                setsearch={setsearch}
                                token={token}
                                onSelectCoin={(data) => {
                                    handleSelectCoin(data);
                                    setShowMobileFavouritesPopup(false);
                                }}
                                onToggleFav={handleAddFav}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Trade;
