import moment from "moment";
import { SPOT_OPEN_ORDER_KINDS } from "../../constants/uiOptions.js";

function nineDecimalFormat(data: any) {
    if (typeof data === "number") return parseFloat(data.toFixed(9));
    return 0;
}

type SpotOrdersPanelProps = {
    openOrders: any[];
    pastOrders: any[];
    positionOrderTab: string;
    setPositionOrderTab: (v: string) => void;
    openOrderKindTab: string;
    setOpenOrderKindTab: (v: string) => void;
    orderType: string;
    setorderType: (v: string) => void;
    pastOrderType: string;
    setpastOrderType: (v: string) => void;
    expandedRowIndex: number | null;
    setExpandedRowIndex: (v: number | null) => void;
    showExecutedTrades: Record<string, boolean>;
    setShowExecutedTrades: (v: Record<string, boolean>) => void;
    SelectedCoin: any;
    onCancelOrder: (orderId: string) => void;
};

export function SpotOrdersPanel({
    openOrders,
    pastOrders,
    positionOrderTab,
    setPositionOrderTab,
    openOrderKindTab,
    setOpenOrderKindTab,
    orderType,
    setorderType,
    pastOrderType,
    setpastOrderType,
    expandedRowIndex,
    setExpandedRowIndex,
    showExecutedTrades,
    setShowExecutedTrades,
    SelectedCoin,
    onCancelOrder,
}: SpotOrdersPanelProps) {
    return (
        <div className="trade_summary_table_lft mt-0 position_order trade_summary_table_lft_position_order">

            {/* Primary tabs */}
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

            {/* Open-orders filter bar */}
            {positionOrderTab === "positions" && (
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
                                className=""
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
            )}

            {/* ── Open Orders ── */}
            <div className={`cnt_table positions ${positionOrderTab === "positions" ? "active" : ""}`}>

                {/* Desktop */}
                <div className="desktop_view2">
                    <div className="table-responsive" style={{ minHeight: "320px" }}>
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
                                                        <div className="c_view justify-content-start">
                                                            <span>
                                                                {moment(item?.updatedAt).format("DD/MM/YYYY")}{" "}
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
                                                    <button
                                                        className="btn text-danger btn-sm btn-icon"
                                                        type="button"
                                                        onClick={() => onCancelOrder(item?.orderId)}
                                                    >
                                                        <i className="ri-delete-bin-6-line pr-0"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr className="no-data-row spot_orders_no_data_row">
                                        <td colSpan={10}>
                                            <div className="spot_orders_empty_state" role="status">
                                                <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile */}
                <div className="order_history_mobile_view twomobile">
                    <div className="d-flex datalist_mbl">
                        {openOrders?.length > 0 ? (
                            openOrders
                                .filter((item) => orderType === item?.side || orderType === "All")
                                .map((item, index) => (
                                    <div key={item?._id || index} className="order_datalist">
                                        <ul className="listdata">
                                            <li><span className="date">Date</span><span className="date_light">{moment(item?.updatedAt).format("DD/MM/YYYY")}</span></li>
                                            <li><span>Time</span><span>{moment(item?.updatedAt).format("hh:mm")}</span></li>
                                            <li><span>Currency Pair</span><span>{SelectedCoin?.base_currency}/{SelectedCoin?.quote_currency}</span></li>
                                            <li><span>Type</span><span>{item?.order_type}</span></li>
                                            <li><span>Side</span><span>{item?.side}</span></li>
                                            <li><span>Price</span><span>{item?.price?.toFixed(8)}</span></li>
                                            <li><span>Amount</span><span>{item?.quantity?.toFixed(8)}</span></li>
                                            <li><span>Remaining</span><span>{item?.remaining?.toFixed(8)}</span></li>
                                            <li><span>Filled</span><span>{item?.filled?.toFixed(8)}</span></li>
                                            <li><span>Total</span><span>{(item?.price * item?.quantity)?.toFixed(8)}</span></li>
                                            <li>
                                                <span>Action</span>
                                                <span>
                                                    <button className="btn text-danger btn-sm btn-icon p-0" type="button" onClick={() => onCancelOrder(item?.orderId ?? item?._id)}>
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ── Placeholder tabs (Trade History / Bots) ── */}
            <div className={`cnt_table tradeHistory ${positionOrderTab === "tradeHistory" ? "active" : ""}`}>
                <div className="desktop_view2">
                    <div className="table-responsive">
                        <div className="spot_orders_empty_state" role="status">
                            <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`cnt_table loan ${positionOrderTab === "loan" ? "active" : ""}`}>
                <div className="desktop_view2">
                    <div className="table-responsive">
                        <div className="spot_orders_empty_state" role="status">
                            <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`cnt_table bots ${positionOrderTab === "bots" ? "active" : ""}`}>
                <div className="desktop_view2">
                    <div className="table-responsive">
                        <div className="spot_orders_empty_state" role="status">
                            <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Order History ── */}
            <div className={`cnt_table orderHistory ${positionOrderTab === "orderHistory" ? "active" : ""}`}>

                {/* Desktop */}
                <div className="desktop_view2">
                    <div className="table-responsive" style={{ height: "353px" }}>
                        <table className="table table_home">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Trading Pair</th>
                                    <th>
                                        <div className="num-div justify-content-start">
                                            <select
                                                className="form-select num-select p-0 input-select cursor-pointer"
                                                value={pastOrderType}
                                                onChange={(e) => setpastOrderType(e.target.value)}
                                            >
                                                <option value="All">All</option>
                                                <option value="BUY">Buy</option>
                                                <option value="SELL">Sell</option>
                                            </select>
                                        </div>
                                    </th>
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
                                {pastOrders?.length > 0 ? (
                                    pastOrders.map((item, index) =>
                                        (item?.side === pastOrderType || pastOrderType === "All") && (
                                            <>
                                                <tr
                                                    key={index}
                                                    onClick={() => setExpandedRowIndex(expandedRowIndex === index ? null : index)}
                                                    className="cursor-pointer"
                                                >
                                                    <td>
                                                        <div className="c_view justify-content-start">
                                                            {item?.executed_prices?.length > 0 && (
                                                                <p className="ms-2 mx-2 text-xl d-inline text-success">
                                                                    {expandedRowIndex === index ? "▾" : "▸"}
                                                                </p>
                                                            )}
                                                            <span>
                                                                {moment(item?.updatedAt).format("DD/MM/YYYY")}{" "}
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
                                                        {item?.status === "FILLED" ? "EXECUTED" : item?.status}
                                                    </td>
                                                </tr>

                                                {expandedRowIndex === index && item?.executed_prices?.length > 0 && (
                                                    <tr>
                                                        <td colSpan={12}>
                                                            <div className="table-responsive bg-dark">
                                                                <table className="table table_home">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Trading price</th>
                                                                            <th>Executed</th>
                                                                            <th>Trading Fee</th>
                                                                            <th>Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {item.executed_prices.map((trade: any, i: number) => (
                                                                            <tr key={i}>
                                                                                <td>{i + 1}</td>
                                                                                <td>{nineDecimalFormat(trade.price)} {item?.side === "BUY" ? item?.pay_currency : item?.ask_currency}</td>
                                                                                <td>{nineDecimalFormat(trade.quantity)} {item?.side === "BUY" ? item?.ask_currency : item?.pay_currency}</td>
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
                                        )
                                    )
                                ) : (
                                    <tr className="no-data-row spot_orders_no_data_row">
                                        <td colSpan={12}>
                                            <div className="spot_orders_empty_state" role="status">
                                                <img src="/images/no-data.svg" alt="" width={120} height={144} className="spot_orders_empty_telescope" />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile */}
                <div className="order_history_mobile_view twomobile">
                    <div className="d-flex datalist_mbl">
                        {pastOrders?.length > 0 ? (
                            pastOrders
                                .filter((item) => item?.side === pastOrderType || pastOrderType === "All")
                                .map((item, index) => (
                                    <div key={item?._id || index} className="order_datalist">
                                        <ul className="listdata">
                                            <li><span className="date">Date</span><span className="date_light">{moment(item?.updatedAt).format("DD/MM/YYYY")}</span></li>
                                            <li><span>Time</span><span>{moment(item?.updatedAt).format("hh:mm")}</span></li>
                                            <li><span>Currency Pair</span><span>{item?.side === "BUY" ? `${item?.ask_currency}/${item?.pay_currency}` : `${item?.pay_currency}/${item?.ask_currency}`}</span></li>
                                            <li><span>Side</span><span>{item?.side}</span></li>
                                            <li><span>Price</span><span>{nineDecimalFormat(item?.price)}</span></li>
                                            <li><span>Average</span><span>{nineDecimalFormat(item?.avg_execution_price)}</span></li>
                                            <li><span>Quantity</span><span>{nineDecimalFormat(item?.quantity)}</span></li>
                                            <li><span>Remaining</span><span>{nineDecimalFormat(item?.remaining)}</span></li>
                                            <li><span>Total</span><span>{nineDecimalFormat(item?.quantity * item?.avg_execution_price)}</span></li>
                                            <li><span>Fee</span><span>{nineDecimalFormat(item?.total_fee)} {item?.ask_currency}</span></li>
                                            <li><span>Order Type</span><span>{item?.order_type}</span></li>
                                            <li>
                                                <span>Status</span>
                                                <span className={`text-${item?.status === "FILLED" ? "success" : item?.status === "CANCELLED" ? "danger" : "warning"}`}>
                                                    {item?.status === "FILLED" ? "EXECUTED" : item?.status}
                                                </span>
                                            </li>
                                        </ul>

                                        {item?.executed_prices?.length > 0 && (
                                            <div className={`executed_trades_list ${showExecutedTrades[item?._id] ? "active" : ""}`}>
                                                <button onClick={() => setShowExecutedTrades({ ...showExecutedTrades, [item?._id]: !showExecutedTrades[item?._id] })}>
                                                    <i className={`ri-arrow-drop-down-line ${showExecutedTrades[item?._id] ? "rotated" : ""}`}></i>Executed Trades
                                                </button>
                                                {showExecutedTrades[item?._id] && (
                                                    <div className="executed_trades_list_items">
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
