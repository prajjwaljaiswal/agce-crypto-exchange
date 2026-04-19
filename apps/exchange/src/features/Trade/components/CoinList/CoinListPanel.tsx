type CoinPairDetail = {
    icon_path?: string;
    iconUrl?: string;
    base_currency: string;
    quote_currency: string;
    base_currency_fullname: string;
    change_percentage: number;
    change: number;
    buy_price: string | number;
    _id: string;
    symbol: string;
};

type CoinListPanelProps = {
    CoinPairDetails: CoinPairDetail[];
    coinFilter: string;
    setcoinFilter: (v: string) => void;
    favCoins: string[];
    SelectedCoin: CoinPairDetail | null;
    search: string;
    setsearch: (v: string) => void;
    token: string | null;
    onSelectCoin: (data: CoinPairDetail) => void;
    onToggleFav: (id: string) => void;
};

export function CoinListPanel({
    CoinPairDetails,
    coinFilter,
    setcoinFilter,
    favCoins,
    SelectedCoin,
    search,
    setsearch,
    token,
    onSelectCoin,
    onToggleFav,
}: CoinListPanelProps) {
    return (
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

            <ul className="favorites_list_tabs p-2 mb-2">
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
                {CoinPairDetails && [...new Set(CoinPairDetails.map(item => item?.quote_currency))].map((quoteCurrency, idx) => (
                    <li key={idx}>
                        <button
                            className={coinFilter === quoteCurrency ? 'active' : ''}
                            onClick={() => setcoinFilter(quoteCurrency as string)}
                        >
                            {quoteCurrency as string}
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
                                if (coinFilter === "FAV" && !favCoins.includes(data?._id)) return null;
                                if (coinFilter !== "FAV" && (data?.quote_currency !== coinFilter && data?.base_currency !== coinFilter)) return null;

                                const isActive =
                                    SelectedCoin?.base_currency === data?.base_currency &&
                                    SelectedCoin?.quote_currency === data?.quote_currency;

                                const iconSrc = data?.iconUrl || data?.icon_path || "/images/new_coin_icon.png";

                                return (
                                    <tr
                                        key={data?._id || data?.symbol || index}
                                        className={isActive ? "active" : ""}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => onSelectCoin(data)}
                                    >
                                        {/* Pair */}
                                        <td>
                                            <div className="d-flex align-items-center gap-1 p-2 ">
                                                <img
                                                    src={iconSrc}
                                                    alt={`${data?.base_currency ?? ""} icon`}
                                                    className="img-fluid me-1 round_img"
                                                    onError={(e) => { const img = e.target as HTMLImageElement; img.onerror = null; img.src = "/images/new_coin_icon.png"; }}
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
                                                    <span className={data.change_percentage >= 0 ? "text-green" : "text-danger"}>
                                                        {data.change_percentage >= 0
                                                            ? `+${data.change_percentage.toFixed(5)}`
                                                            : data.change_percentage.toFixed(5)}%
                                                    </span>
                                                    <span className="tokensubcnt">{parseFloat(data.change.toFixed(5)) || 0}</span>
                                                </div>

                                                {token && (
                                                    <i
                                                        className={favCoins.includes(data?._id) ? "ri ri-star-fill ri-xl" : "ri ri-star-line ri-xl"}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleFav(data?._id);
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
    );
}
