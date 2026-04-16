import React from "react";
import { Link } from "react-router-dom";
import type { OrderFormApi } from "../../hooks/useOrderForm";
import { formatPriceThousands, formatTotal } from "../../utils/formatting";

type OrderFormProps = {
    form: OrderFormApi;
    SelectedCoin: any;
    BuyCoinBal: number | undefined;
    SellCoinBal: number | undefined;
    buyprice: number;
    sellPrice: number;
    token: string | null;
    KycStatus: number | boolean | undefined;
    isSpotDisabled: boolean;
    onBuy: () => void;
    onSell: () => void;
    onLoginRedirect: () => void;
};

export function OrderForm({
    form,
    SelectedCoin,
    BuyCoinBal,
    SellCoinBal,
    buyprice,
    sellPrice,
    token,
    KycStatus,
    isSpotDisabled,
    onBuy,
    onSell,
    onLoginRedirect,
}: OrderFormProps) {
    const {
        showBuySellTab, setShowBuySellTab,
        infoPlaceOrder, setinfoPlaceOrder,
        isConditionalMenuOpen, setIsConditionalMenuOpen,
        buyOrderPrice, setbuyOrderPrice,
        buyamount, setbuyamount,
        buyStopPrice, setBuyStopPrice,
        limitBuyPercent,
        limitBuyFok, setLimitBuyFok,
        limitBuyIoc, setLimitBuyIoc,
        marketBuyPercent,
        buySlippageEnabled, setBuySlippageEnabled,
        buySlippageInput, setBuySlippageInput,
        sellOrderPrice, setsellOrderPrice,
        sellAmount, setsellAmount,
        sellStopPrice, setSellStopPrice,
        limitSellPercent,
        limitSellFok, setLimitSellFok,
        limitSellIoc, setLimitSellIoc,
        marketSellPercent,
        stopPercent, setStopPercent,
        priceFieldFocus, setPriceFieldFocus,
        isStopOrder, isLimitBuyUi, showSpotOrderFooter,
        handlePriceInput, handleQuantityInput,
        handlePriceBlur, handleQuantityBlur,
        nudgeBuyOrderPrice, nudgeSellOrderPrice,
        applyLimitBuySlider, applyMarketBuySlider,
        applyLimitSellSlider, applyMarketSellSlider,
    } = form;

    return (
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
                                            value={buyStopPrice !== '' ? buyStopPrice : formatTotal(buyprice || 0, SelectedCoin)}
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
                                                    ? (buyOrderPrice !== "" ? buyOrderPrice : formatTotal(buyprice || 0, SelectedCoin))
                                                    : formatPriceThousands(buyOrderPrice !== "" ? buyOrderPrice : String(buyprice ?? ""), SelectedCoin)
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
                                                    ? formatTotal((+(buyOrderPrice !== "" && buyOrderPrice ? buyOrderPrice : buyprice) || 0) * +buyamount, SelectedCoin)
                                                    : formatTotal(0, SelectedCoin)
                                            }
                                        />
                                        <span className="input-group-text text-start">
                                            <small>{SelectedCoin?.quote_currency}</small>
                                        </span>
                                    </div>
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
                                                    ? `${formatTotal(BuyCoinBal, SelectedCoin)} ${SelectedCoin?.quote_currency}`
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

                            <>
                                {token ?
                                    KycStatus === 0 || KycStatus === 1 || KycStatus === 3 ?
                                        <Link to={KycStatus === 1 ? "" : '/user_profile/kyc'
                                        } className={`btn custom-btn btn-success btn-mini  w-100 my-3 my-md-0`}>
                                            {KycStatus === 1 ? "Verification Pending" : KycStatus === 0 ? "Submit Kyc" : "Kyc Rejected Verify Again"}
                                        </Link> :
                                        <button type='button' className="btn custom-btn btn-success btn-mini  w-100 my-3 my-md-0"
                                            onClick={() => !isSpotDisabled && onBuy()}
                                            disabled={isSpotDisabled}>
                                            {isSpotDisabled ? 'Trading Disabled' : `Buy ${SelectedCoin?.base_currency}`}
                                        </button>
                                    :
                                    <div className="order-btns my-2" >
                                        <button type='button' className="btn custom-btn btn-success btn-mini  w-100 my-3 my-md-0"
                                            onClick={onLoginRedirect}>
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
                                            value={sellStopPrice !== '' ? sellStopPrice : formatTotal(sellPrice || 0, SelectedCoin)}
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
                                                    ? (sellOrderPrice !== "" ? sellOrderPrice : formatTotal(sellPrice || 0, SelectedCoin))
                                                    : formatPriceThousands(sellOrderPrice !== "" ? sellOrderPrice : String(sellPrice ?? ""), SelectedCoin)
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
                                                ? formatTotal((+(sellOrderPrice !== '' && sellOrderPrice ? sellOrderPrice : sellPrice) || 0) * +sellAmount, SelectedCoin)
                                                : formatTotal(0, SelectedCoin)}

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
                                                    ? `${formatTotal(SellCoinBal, SelectedCoin)} ${SelectedCoin?.base_currency}`
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

                            <>
                                {token ?
                                    KycStatus === 0 || KycStatus === 1 || KycStatus === 3 ?
                                        <Link to={KycStatus === 1 ? "" : '/user_profile/kyc'
                                        } className={`btn custom-btn btn-danger btn-mini w-100 my-3 my-md-0`}>
                                            {KycStatus === 1 ? "Verification Pending" : KycStatus === 0 ? "Submit Kyc" : "Kyc Rejected Verify Again"}
                                        </Link> :
                                        <button type='button' className="btn custom-btn btn-danger btn-mini w-100 my-3 my-md-0"
                                            onClick={() => !isSpotDisabled && onSell()}
                                            disabled={!sellAmount || !token || sellAmount === 0 || isSpotDisabled}>
                                            {isSpotDisabled ? 'Trading Disabled' : `Sell ${SelectedCoin?.base_currency}`}
                                        </button>
                                    :
                                    <div className="order-btns my-2" >
                                        <button type='button' className="btn custom-btn btn-success btn-mini  w-100 my-3 my-md-0"
                                            onClick={onLoginRedirect}>
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

                </div>

            </div>

        </div>
    );
}
