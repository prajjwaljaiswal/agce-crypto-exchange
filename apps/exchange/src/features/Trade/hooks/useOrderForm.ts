import { useCallback, useEffect } from "react";
import { alertErrorMessage } from "../CustomAlertMessage";
import {
    formatPrice,
    formatQuantity,
    getPricePrecision,
    isValidPriceInput,
    isValidQuantityInput,
} from "../utils/formatting";
import {
    dAdd,
    dDiv,
    dFloorToStep,
    dGtZero,
    dIsMultipleOf,
    dPct,
    dRoundToStep,
    dSub,
    dToFixed,
    dToNumber,
} from "../utils/decimal.js";
import { useOrderFormStore } from "../stores/orderFormStore.js";

export type OrderKind = "LIMIT" | "MARKET" | "STOP_LIMIT" | "STOP_MARKET";
export type BuySellTab = "" | "buy" | "sell";

type UseOrderFormArgs = {
    SelectedCoin: any;
    BuyCoinBal: number | undefined;
    SellCoinBal: number | undefined;
    buyprice: number;
    sellPrice: number;
};

// All buy/sell order-form state + the handlers that only mutate form state.
// Cross-cutting actions (handleOrderPlace, handleSelectCoin) live in Trade
// and drive these setters directly.
export function useOrderForm({
    SelectedCoin,
    BuyCoinBal,
    SellCoinBal,
    buyprice,
    sellPrice,
}: UseOrderFormArgs) {
    const {
        showBuySellTab, setShowBuySellTab,
        infoPlaceOrder, setinfoPlaceOrder,
        isConditionalMenuOpen, setIsConditionalMenuOpen,
        buyOrderPrice, setbuyOrderPrice,
        buyamount, setbuyamount,
        buyStopPrice, setBuyStopPrice,
        limitBuyPercent, setLimitBuyPercent,
        limitBuyFok, setLimitBuyFok,
        limitBuyIoc, setLimitBuyIoc,
        marketBuyPercent, setMarketBuyPercent,
        buySlippageEnabled, setBuySlippageEnabled,
        buySlippageInput, setBuySlippageInput,
        sellOrderPrice, setsellOrderPrice,
        sellAmount, setsellAmount,
        sellStopPrice, setSellStopPrice,
        limitSellPercent, setLimitSellPercent,
        limitSellFok, setLimitSellFok,
        limitSellIoc, setLimitSellIoc,
        marketSellPercent, setMarketSellPercent,
        stopPercent, setStopPercent,
        priceFieldFocus, setPriceFieldFocus,
    } = useOrderFormStore();

    // Derived
    const isStopOrder = infoPlaceOrder === "STOP_LIMIT" || infoPlaceOrder === "STOP_MARKET";
    const isLimitBuyUi = infoPlaceOrder === "LIMIT" && !isStopOrder;
    const showSpotOrderFooter =
        infoPlaceOrder === "LIMIT" ||
        infoPlaceOrder === "MARKET" ||
        infoPlaceOrder === "STOP_LIMIT" ||
        infoPlaceOrder === "STOP_MARKET";

    // Input handlers — tick/step-aware, block invalid values while typing.
    const handlePriceInput = useCallback((value: any, setter: (v: any) => void) => {
        const stripped = String(value).replace(/,/g, "");
        if (isValidPriceInput(stripped, SelectedCoin)) setter(stripped);
    }, [SelectedCoin]);

    const handleQuantityInput = useCallback((value: any, setter: (v: any) => void) => {
        if (isValidQuantityInput(value, SelectedCoin)) setter(value);
    }, [SelectedCoin]);

    // Decimal-safe helpers — use for any calc that hits price/qty/balance.
    const floorQtyToStep = useCallback((val: string | number): number => {
        const step = SelectedCoin?.step_size ?? "0.00001";
        return dToNumber(dFloorToStep(val, step));
    }, [SelectedCoin]);

    const snapPriceToTick = useCallback((val: string | number): string => {
        const tick = SelectedCoin?.tick_size ?? "0.01";
        const prec = getPricePrecision(SelectedCoin);
        return dToFixed(dRoundToStep(val, tick), prec).replace(/\.?0+$/, "");
    }, [SelectedCoin]);

    // Buy-amount derived from slider percentage of quote balance.
    const deriveBuyAmountFromPct = useCallback((pct: number, refPrice: string | number): number => {
        if (BuyCoinBal === undefined || BuyCoinBal === null) return 0;
        if (!dGtZero(refPrice)) return 0;
        // (balance * pct / 100) / price, floored to step_size.
        const spend = dPct(BuyCoinBal, pct);
        const qty = dDiv(spend, refPrice);
        return floorQtyToStep(qty);
    }, [BuyCoinBal, floorQtyToStep]);

    const handlePriceBlur = useCallback((value: any, setter: (v: any) => void) => {
        const v = String(value).replace(/,/g, "");
        if (v === "" || v === "0" || v === "0.") { setter(""); return; }
        if (!dGtZero(v)) { setter(""); return; }
        const tickSize = SelectedCoin?.tick_size ?? "0.01";
        if (dToNumber(v) < dToNumber(tickSize)) { setter(String(tickSize)); return; }
        setter(snapPriceToTick(v));
    }, [SelectedCoin, snapPriceToTick]);

    const handleQuantityBlur = useCallback((value: any, setter: (v: any) => void) => {
        if (value === "" || value === "0" || value === "0.") { setter(""); return; }
        if (!dGtZero(value)) { setter(""); return; }
        const stepSize = SelectedCoin?.step_size ?? "0.00001";
        if (dToNumber(value) < dToNumber(stepSize)) { setter(String(stepSize)); return; }
        // Round to step, then to price-precision string.
        const rounded = dRoundToStep(value, stepSize);
        const prec = getPricePrecision(SelectedCoin);
        setter(dToFixed(rounded, prec).replace(/\.?0+$/, ""));
    }, [SelectedCoin]);

    const nudgeBuyOrderPrice = useCallback((direction: number) => {
        const tick = SelectedCoin?.tick_size ?? "0.01";
        const s = useOrderFormStore.getState();
        const base = s.buyOrderPrice !== "" ? s.buyOrderPrice : (buyprice ?? 0);
        // Snap to tick, then step by direction * tick.
        const snapped = dRoundToStep(base, tick);
        const stepped = dRoundToStep(
            // snapped + direction*tick
            direction >= 0 ? dAdd(snapped, tick) : dSub(snapped, tick),
            tick,
        );
        // Clamp to at least one tick above zero.
        const clamped = dToNumber(stepped) < dToNumber(tick) ? String(tick) : stepped;
        const nextStr = snapPriceToTick(clamped);
        setbuyOrderPrice(nextStr);
        if (s.infoPlaceOrder === "LIMIT" && BuyCoinBal) {
            setbuyamount(deriveBuyAmountFromPct(s.limitBuyPercent, nextStr));
        }
    }, [SelectedCoin, buyprice, BuyCoinBal, setbuyOrderPrice, setbuyamount, snapPriceToTick, deriveBuyAmountFromPct]);

    const nudgeSellOrderPrice = useCallback((direction: number) => {
        const tick = SelectedCoin?.tick_size ?? "0.01";
        const s = useOrderFormStore.getState();
        const base = s.sellOrderPrice !== "" ? s.sellOrderPrice : (sellPrice ?? 0);
        const snapped = dRoundToStep(base, tick);
        const stepped = dRoundToStep(
            direction >= 0 ? dAdd(snapped, tick) : dSub(snapped, tick),
            tick,
        );
        const clamped = dToNumber(stepped) < dToNumber(tick) ? String(tick) : stepped;
        setsellOrderPrice(snapPriceToTick(clamped));
    }, [SelectedCoin, sellPrice, setsellOrderPrice, snapPriceToTick]);

    const applyLimitBuySlider = useCallback((pct: number) => {
        const safe = [0, 25, 50, 75, 100].includes(pct) ? pct : 0;
        setLimitBuyPercent(safe);
        const s = useOrderFormStore.getState();
        const refPrice = s.buyOrderPrice !== "" ? s.buyOrderPrice : (buyprice ?? 0);
        setbuyamount(deriveBuyAmountFromPct(safe, refPrice));
    }, [buyprice, setLimitBuyPercent, setbuyamount, deriveBuyAmountFromPct]);

    const applyMarketBuySlider = useCallback((pct: number) => {
        const safe = [0, 25, 50, 75, 100].includes(pct) ? pct : 0;
        setMarketBuyPercent(safe);
        setbuyamount(deriveBuyAmountFromPct(safe, buyprice ?? 0));
    }, [buyprice, setMarketBuyPercent, setbuyamount, deriveBuyAmountFromPct]);

    const applyMarketSellSlider = useCallback((pct: number) => {
        const safe = [0, 25, 50, 75, 100].includes(pct) ? pct : 0;
        setMarketSellPercent(safe);
        if (SellCoinBal === undefined || SellCoinBal === null) return;
        setsellAmount(floorQtyToStep(dPct(SellCoinBal, safe)));
    }, [SellCoinBal, floorQtyToStep, setMarketSellPercent, setsellAmount]);

    const applyLimitSellSlider = useCallback((pct: number) => {
        const safe = [0, 25, 50, 75, 100].includes(pct) ? pct : 0;
        setLimitSellPercent(safe);
        if (SellCoinBal === undefined || SellCoinBal === null) return;
        setsellAmount(floorQtyToStep(dPct(SellCoinBal, safe)));
    }, [SellCoinBal, floorQtyToStep, setLimitSellPercent, setsellAmount]);

    // Light client-side sanity checks. Authoritative validation lives server-side.
    const validateOrder = useCallback((price: any, quantity: any, _side: any) => {
        if (!dGtZero(quantity)) {
            alertErrorMessage("Enter a quantity greater than 0.");
            return false;
        }

        const s = useOrderFormStore.getState();
        const needsPrice = s.infoPlaceOrder === "LIMIT" || s.infoPlaceOrder === "STOP_LIMIT";
        if (needsPrice && !dGtZero(price)) {
            alertErrorMessage("Enter a price greater than 0.");
            return false;
        }

        const tick_size = SelectedCoin?.tick_size;
        if (needsPrice && tick_size && !dIsMultipleOf(price, tick_size)) {
            alertErrorMessage(`Price must be a multiple of ${tick_size}`);
            return false;
        }

        const step_size = SelectedCoin?.step_size;
        if (step_size && !dIsMultipleOf(quantity, step_size)) {
            alertErrorMessage(`Quantity must be a multiple of ${step_size}`);
            return false;
        }

        return true;
    }, [SelectedCoin]);

    // Called from handleSelectCoin when switching pairs. Clear the price fields
    // so the seed effect re-fills them from the new pair's market price. Reset
    // slider + amount to 0 — the user should start fresh on the new pair.
    const resetForm = useCallback(() => {
        setinfoPlaceOrder("LIMIT");
        setsellOrderPrice("");
        setbuyOrderPrice("");
        setbuyamount(0);
        setsellAmount(0);
        setLimitBuyPercent(0);
        setLimitSellPercent(0);
        setMarketBuyPercent(0);
        setMarketSellPercent(0);
    }, [
        setinfoPlaceOrder,
        setsellOrderPrice,
        setbuyOrderPrice,
        setbuyamount,
        setsellAmount,
        setLimitBuyPercent,
        setLimitSellPercent,
        setMarketBuyPercent,
        setMarketSellPercent,
    ]);

    // Called from order-book row clicks.
    // Ask rows (green) = sellers offering → user wants to BUY at that price.
    const fillFromAskRow = useCallback((data: { price: number; remaining: number }) => {
        setShowBuySellTab("buy");
        setbuyamount(formatQuantity(data.remaining, SelectedCoin));
        const s = useOrderFormStore.getState();
        if (s.infoPlaceOrder !== "MARKET") setbuyOrderPrice(formatPrice(data.price, SelectedCoin));
    }, [SelectedCoin, setShowBuySellTab, setbuyamount, setbuyOrderPrice]);

    // Bid rows (red) = buyers offering → user wants to SELL at that price.
    const fillFromBidRow = useCallback((data: { price: number; remaining: number }) => {
        setShowBuySellTab("sell");
        setsellAmount(formatQuantity(data.remaining, SelectedCoin));
        const s = useOrderFormStore.getState();
        if (s.infoPlaceOrder !== "MARKET") setsellOrderPrice(formatPrice(data.price, SelectedCoin));
    }, [SelectedCoin, setShowBuySellTab, setsellAmount, setsellOrderPrice]);

    // Seed the buy/sell price inputs with the current market price when they're
    // empty (initial load, pair switch after resetForm() wipes them). We check
    // `=== ""` so the effect never overwrites a value the user has typed in —
    // only fills the blank. Pair switch → resetForm clears to "" → this fires.
    useEffect(() => {
        if (buyOrderPrice === "" && buyprice && buyprice > 0) {
            setbuyOrderPrice(formatPrice(buyprice, SelectedCoin));
        }
    }, [buyprice, buyOrderPrice, SelectedCoin, setbuyOrderPrice]);

    useEffect(() => {
        if (sellOrderPrice === "" && sellPrice && sellPrice > 0) {
            setsellOrderPrice(formatPrice(sellPrice, SelectedCoin));
        }
    }, [sellPrice, sellOrderPrice, SelectedCoin, setsellOrderPrice]);

    return {
        // tabs / mode
        showBuySellTab, setShowBuySellTab,
        infoPlaceOrder, setinfoPlaceOrder,
        isConditionalMenuOpen, setIsConditionalMenuOpen,

        // buy form
        buyOrderPrice, setbuyOrderPrice,
        buyamount, setbuyamount,
        buyStopPrice, setBuyStopPrice,
        limitBuyPercent,
        limitBuyFok, setLimitBuyFok,
        limitBuyIoc, setLimitBuyIoc,
        marketBuyPercent,
        buySlippageEnabled, setBuySlippageEnabled,
        buySlippageInput, setBuySlippageInput,

        // sell form
        sellOrderPrice, setsellOrderPrice,
        sellAmount, setsellAmount,
        sellStopPrice, setSellStopPrice,
        limitSellPercent,
        limitSellFok, setLimitSellFok,
        limitSellIoc, setLimitSellIoc,
        marketSellPercent,

        // shared
        stopPercent, setStopPercent,
        priceFieldFocus, setPriceFieldFocus,

        // derived
        isStopOrder,
        isLimitBuyUi,
        showSpotOrderFooter,

        // handlers
        handlePriceInput, handleQuantityInput,
        handlePriceBlur, handleQuantityBlur,
        nudgeBuyOrderPrice, nudgeSellOrderPrice,
        applyLimitBuySlider, applyMarketBuySlider,
        applyLimitSellSlider, applyMarketSellSlider,
        validateOrder,
        resetForm,
        fillFromAskRow, fillFromBidRow,
    };
}

export type OrderFormApi = ReturnType<typeof useOrderForm>;
