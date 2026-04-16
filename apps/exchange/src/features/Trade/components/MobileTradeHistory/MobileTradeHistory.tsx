type MobileTradeHistoryProps = {
    SelectedCoin: any;
    RecentTrade: any[];
    showTab: string;
};

export function MobileTradeHistory({ SelectedCoin, RecentTrade, showTab }: MobileTradeHistoryProps) {
    return (
        <div className="col-lg-6 d-lg-none">
            <div id="tab_mobile_trade_history" className={`trade_card orderbook_two ${showTab !== "trade_history" ? "d-none" : ""}`}>
                <div className="trade_history_tab">
                    <div className="table-responsive">
                        <table className="table table-sm table-borderless mb-0 orderbook-table">
                            <thead>
                                <tr>
                                    <th className="text-start">Price ({SelectedCoin?.quote_currency})</th>
                                    <th className="text-end">Quantity ({SelectedCoin?.base_currency})</th>
                                    <th className="text-end">Time</th>
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
            </div>
        </div>
    );
}
