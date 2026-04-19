import { useRef, useState } from "react";
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

const ASSET_ACTIONS = [
    { label: "Deposit", icon: "ri-download-2-line", path: "/asset_managemnet/deposit" },
    { label: "Withdraw", icon: "ri-upload-2-line", path: "/asset_managemnet/withdraw" },
    { label: "Convert", icon: "ri-swap-line", path: "/user_profile/swap" },
    { label: "Transfer", icon: "ri-arrow-left-right-line", path: "/user_profile/asset_overview" },
    { label: "History", icon: "ri-time-line", path: "/user_profile/asset_overview" },
];

export function AssetsPanel({
    SelectedCoin,
    BuyCoinBal,
    SellCoinBal,
    token,
    spotWallets,
    walletsLoading,
    onRefresh,
}: AssetsPanelProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragState = useRef({ startX: 0, scrollLeft: 0, moved: false });

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = sliderRef.current;
        if (!el) return;
        setIsDragging(true);
        dragState.current = {
            startX: e.clientX,
            scrollLeft: el.scrollLeft,
            moved: false,
        };
        el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !sliderRef.current) return;
        const dx = e.clientX - dragState.current.startX;
        if (Math.abs(dx) > 4) dragState.current.moved = true;
        sliderRef.current.scrollLeft = dragState.current.scrollLeft - dx;
    };

    const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setIsDragging(false);
        sliderRef.current?.releasePointerCapture(e.pointerId);
    };

    const suppressClickIfDragged = (e: React.MouseEvent) => {
        if (dragState.current.moved) {
            e.preventDefault();
            dragState.current.moved = false;
        }
    };

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

                <div
                    ref={sliderRef}
                    className={`assets_panel_actions assets_panel_slider${isDragging ? " is-dragging" : ""}`}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                >
                    {ASSET_ACTIONS.map((action) => (
                        <Link
                            key={action.label}
                            className="assets_panel_pill"
                            to={token ? action.path : "/login"}
                            onClick={suppressClickIfDragged}
                            draggable={false}
                        >
                            <i className={action.icon} aria-hidden="true" />
                            <span>{action.label}</span>
                        </Link>
                    ))}
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
