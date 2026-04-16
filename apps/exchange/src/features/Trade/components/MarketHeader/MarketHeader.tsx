type MarketHeaderProps = {
    SelectedCoin: any;
    buyprice: number;
    isPricePositive: boolean;
    priceChange: number;
    changesHour: number;
    priceHigh: number;
    priceLow: number;
    volume: number;
    onPairClick: () => void;
};

export function MarketHeader({
    SelectedCoin,
    buyprice,
    isPricePositive,
    priceChange,
    changesHour,
    priceHigh,
    priceLow,
    volume,
    onPairClick,
}: MarketHeaderProps) {

    return (
        <div className="trade_card p-2 overflow_card mb-1">
            <div className="headline_left__lBBPY">

                <div className="headline_left__lBBPY_leftmain d-flex align-items-center">
                    <div
                        className="headline_symbolName__KfmIZ mt_tr_pr cursor-pointer"
                        onClick={onPairClick}
                    >
                        <div className="headline_bigName__dspVW">
                            <img alt="" src={SelectedCoin?.icon_path} width="24" className="img-fluid round_img" onError={(e) => { const img = e.target as HTMLImageElement; img.onerror = null; img.src = "/images/new_coin_icon.png"; }} />
                        </div>

                        <div>
                            
                            <div className="headline_bigName__dspVW">
                                <h1>
                                    {SelectedCoin ? `${SelectedCoin?.base_currency}/${SelectedCoin?.quote_currency}` : "---/---"}
                                    <i className="ri-arrow-down-s-line ms-1"></i>
                                </h1>
                            </div>
                            <div className="headline_etfDisplay__P4Hdv">
                                <span>{SelectedCoin?.base_currency_fullname}</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: last price */}
                    <div className="headline_leftItem__7BFYq headline_latestPrice__AYXu0 d-lg-none ms-0 mt-1">
                        <div>
                            <span className={`headline_title__x1csO font-weight-boldd ${isPricePositive ? "text-green" : "text-danger"}`}>
                                {SelectedCoin ? parseFloat(buyprice?.toFixed(8)) : 0}
                            </span>
                        </div>
                    </div>

                    {/* Mobile: 24h change */}
                    <div className="headline_leftItem__7BFYq ms-0 d-flex d-lg-none">
                        <div className="-1">24h Change</div>
                        <div className={`headline_title__x1csO font-weight-boldd ${priceChange >= 0 ? "text-green" : "text-danger"}`}>
                            {priceChange >= 0 ? "+" : ""}{Number(priceChange).toFixed(2)}%
                            <span className="ms-1">{Number(changesHour).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="scroll-subtabs_scrollSubInfo__T5nZF headline_left__lBBPY_rightmain">
                    <div className="scroll-subtabs_tabs__Prom8">
                        <div className="scroll-subtabs_subMarketWrap__XVmHp">
                            <div className="headline_extendInfoWrapper__dooIS">

                                {/* Desktop: last price */}
                                <div className="headline_leftItem__7BFYq d-none d-lg-block">
                                    <div className="headline_withBorder__a6ZD2">
                                        Last Price ({SelectedCoin?.quote_currency})
                                    </div>
                                    <span className={`headline_title__x1csO font-weight-boldd ${isPricePositive ? "text-green" : "text-danger"}`}>
                                        {SelectedCoin ? parseFloat(buyprice?.toFixed(8)) : 0}
                                    </span>
                                </div>

                                {/* Desktop: 24h change */}
                                <div className="headline_leftItem__7BFYq d-none d-lg-block">
                                    <div className="headline_withBorder__a6ZD2">24h Change</div>
                                    <div className={`headline_title__x1csO font-weight-boldd ${priceChange >= 0 ? "text-green" : "text-danger"}`}>
                                        {priceChange >= 0 ? "+" : ""}{Number(priceChange).toFixed(2)}%
                                    </div>
                                </div>

                                <div className="headline_leftItem__7BFYq">
                                    <div className="headline_withBorder__a6ZD2">
                                        24h High ({SelectedCoin?.quote_currency})
                                    </div>
                                    <div className="headline_title__x1csO text-success font-weight-boldd">
                                        {Number(priceHigh).toFixed(2)}
                                    </div>
                                </div>

                                <div className="headline_leftItem__7BFYq">
                                    <div className="headline_withBorder__a6ZD2">
                                        24h Low ({SelectedCoin?.quote_currency})
                                    </div>
                                    <div className="headline_title__x1csO text-danger font-weight-boldd">
                                        {Number(priceLow).toFixed(2)}
                                    </div>
                                </div>

                                <div className="headline_leftItem__7BFYq">
                                    <div className="headline_withBorder__a6ZD2">
                                        24h Volume ({SelectedCoin?.base_currency})
                                    </div>
                                    <div className="headline_title__x1csO font-weight-boldd">
                                        {Number(volume).toFixed(2)}
                                    </div>
                                </div>

                                <div className="headline_leftItem__7BFYq">
                                    <div className="headline_withBorder__a6ZD2">
                                        24h Volume ({SelectedCoin?.quote_currency})
                                    </div>
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
    );
}
