import { Link } from "react-router-dom";

type MobileWalletsPanelProps = {
    showTab: string;
    token: string | null;
    spotWallets: any[];
    walletsLoading: boolean;
    onRefresh: () => void;
};

export function MobileWalletsPanel({ showTab, token, spotWallets, walletsLoading, onRefresh }: MobileWalletsPanelProps) {
    return (
        <div className="col-lg-6 d-lg-none">
            <div className="assets_right mobile_assets_right">
                <div id="tab_4_mobile" className={`trade_card orderbook_two ${showTab !== "wallets" ? "d-none" : ""}`}>
                    <div className="assets_list">
                        <div className="top_heading">
                            <h4>Spot Wallets<i className="ri-refresh-line cursor-pointer" onClick={onRefresh}></i></h4>
                            <Link className="more_btn" to="/user_profile/asset_overview">
                                <i className="ri-exchange-funds-fill"></i> Transfer
                            </Link>
                        </div>
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
                                        <img src="/images/no_data_vector.svg" className="img-fluid dark_img" width="96" height="96" alt="" />
                                        <img src="/images/no_data_vector_light.png" className="img-fluid light_img" width="96" height="96" alt="" />
                                        <p className="mt-2">Please login to view your wallets</p>
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
                                                                onError={(e) => { const img = e.target as HTMLImageElement; img.onerror = null; img.src = "/images/new_coin_icon.png"; }}
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
                                                            <img src="/images/no_data_vector.svg" className="img-fluid dark_img" width="64" height="64" alt="" />
                                                            <img src="/images/no_data_vector_light.png" className="img-fluid light_img" width="64" height="64" alt="" />
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
    );
}
