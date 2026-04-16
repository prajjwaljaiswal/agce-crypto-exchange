import { Link } from "react-router-dom";

type AssetsPanelProps = {
    SelectedCoin: any;
    BuyCoinBal: number | undefined;
    SellCoinBal: number | undefined;
    token: string | null;
    spotWallets: any[];
    walletsLoading: boolean;
    onRefresh: () => void;
};

export function AssetsPanel({
    SelectedCoin,
    BuyCoinBal,
    SellCoinBal,
    token,
    spotWallets,
    walletsLoading,
    onRefresh,
}: AssetsPanelProps) {
    return (
        <div className="assets_right d-none d-lg-block assets_panel_desktop">
            <div id="tab_4" className="assets_panel_inner">
                <div className="assets_panel_header">
                    <h5 className="assets_panel_title">Assets</h5>
                    <button type="button" className="assets_panel_refresh" onClick={onRefresh} aria-label="Refresh balances">
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
                    <Link className="assets_panel_pill" to={token ? "/asset_managemnet/deposit" : "/login"}>Deposit</Link>
                    <Link className="assets_panel_pill" to={token ? "/user_profile/swap" : "/login"}>Convert</Link>
                    <Link className="assets_panel_pill" to={token ? "/user_profile/asset_overview" : "/login"}>Transfer</Link>
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
                                                    onError={(e) => { const img = e.target as HTMLImageElement; img.onerror = null; img.src = "/images/new_coin_icon.png"; }}
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
    );
}
