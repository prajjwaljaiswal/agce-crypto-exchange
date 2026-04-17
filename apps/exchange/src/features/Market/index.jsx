import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./market-quote-select.css";
import MarketQuoteSelect from "./MarketQuoteSelect";
import { useMarketTickers } from "./useMarketTickers.js";
import {
  COIN_NAMES,
  splitPair,
  fmtPrice,
  fmtShortUsd,
  fmtPct,
} from "./marketFormat.js";

const FEATURED = [
  { symbol: "BTC-USDT", base: "BTC", name: "Bitcoin" },
  { symbol: "ETH-USDT", base: "ETH", name: "Ethereum" },
  { symbol: "BNB-USDT", base: "BNB", name: "Binance Coin" },
];

const QUOTE_OPTIONS = ["USDT", "USDC", "BTC", "ETH", "BNB", "All"];
const SPOT_SUBTABS = [
  { key: "all", label: "All" },
  { key: "gainers", label: "Gainers" },
  { key: "losers", label: "Losers" },
  { key: "trending", label: "Trending" },
];
const TABLE_LIMIT = 100;


function CoinIcon({ base }) {
  const src = `/images/market-img/icons/${base.toLowerCase()}.svg`;
  const letter = base.charAt(0);
  return (
    <img
      alt={base}
      src={src}
      className="img-fluid icon_img coinimg me-2"
      onError={(e) => {
        const parent = e.currentTarget.parentElement;
        if (!parent) return;
        e.currentTarget.style.display = "none";
        if (!parent.querySelector(".coin-fallback")) {
          const span = document.createElement("span");
          span.className = "coin-fallback me-2";
          span.textContent = letter;
          span.style.cssText =
            "display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#2a2a2a;color:#e5b64a;font-weight:700;font-size:12px;";
          parent.insertBefore(span, e.currentTarget);
        }
      }}
    />
  );
}

function FeaturedCard({ info, ticker }) {
  const pct = ticker ? ticker.priceChangePercent : null;
  const positive = pct != null && pct >= 0;
  const to = `/trade/${info.base}_USDT`;
  return (
    <Link to={to} className="text-decoration-none text-reset d-block">
      <div className="trade_marketvalue" style={{ cursor: "pointer" }}>
        <div className="market_value_card">
          <div className="d-flex tophd">
            <h5>
              <CoinIcon base={info.base} />
              {info.base}
            </h5>
            <div className={positive ? "value text-green" : "value text-danger"}>
              {ticker ? fmtPct(pct) : "—"}
            </div>
          </div>
          <div className="price">
            {ticker ? `$${fmtPrice(ticker.lastPrice)}` : "—"}
          </div>
        </div>
        <div className="privevolume">
          <span>24H Volume：</span>
          {ticker ? `${fmtPrice(ticker.quoteVolume)} (USD)` : "—"}
        </div>
      </div>
    </Link>
  );
}

const Market = () => {
  const { tickers, isLoading, error } = useMarketTickers();
  const [quoteFilter, setQuoteFilter] = useState("USDT");
  const [subTab, setSubTab] = useState("all");
  const [search, setSearch] = useState("");

  const allList = useMemo(() => Object.values(tickers), [tickers]);

  const featuredCards = FEATURED.map((info) => ({
    info,
    ticker: tickers[info.symbol],
  }));

  const rows = useMemo(() => {
    let list = allList;

    if (quoteFilter !== "All") {
      list = list.filter((t) => splitPair(t.symbol).quote === quoteFilter);
    }

    if (search.trim()) {
      const q = search.trim().toUpperCase();
      list = list.filter((t) => t.symbol.includes(q));
    }

    list = [...list];
    if (subTab === "gainers") {
      list.sort((a, b) => b.priceChangePercent - a.priceChangePercent);
    } else if (subTab === "losers") {
      list.sort((a, b) => a.priceChangePercent - b.priceChangePercent);
    } else if (subTab === "trending") {
      list.sort((a, b) => b.count - a.count);
    } else {
      list.sort((a, b) => b.quoteVolume - a.quoteVolume);
    }

    return list.slice(0, TABLE_LIMIT);
  }, [allList, quoteFilter, subTab, search]);

  return (
    <>
      <Helmet>
        <title>AGCE Market – Live Crypto Prices &amp; Trading Pairs</title>
        <meta
          name="description"
          content="Explore live market data on AGCE. View real-time prices, volumes and trading pairs for Bitcoin, Ethereum and top altcoins. Start trading today."
        />
      </Helmet>

      <section className="section-padding login_bg login_sec market_page">
        <div className="market_trade_crypto">
          <div className="container">
            <div className="row d-none d-md-flex">
              {featuredCards.map(({ info, ticker }) => (
                <div className="col-sm-4" key={info.symbol}>
                  <FeaturedCard info={info} ticker={ticker} />
                </div>
              ))}
            </div>

            <div className="d-md-none market_trade_crypto_slider">
              {featuredCards.map(({ info, ticker }) => (
                <div className="mb-3" key={`m-${info.symbol}`}>
                  <FeaturedCard info={info} ticker={ticker} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="live_prices mt-0 market_prices market_update_sec market_update_table">
          <div className="container">
            <div className="d-flex-between mb-3 custom_dlflex">
              <ul className="nav nav-pills mb-2 overflowx_scroll funds_tab market_tabs" role="tablist">
                <li className="nav-item">
                  <button type="button" className="nav-link">Favorites</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link active">Spot</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link">Futures</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link">Cryptos</button>
                </li>
                <li className="nav-item">
                  <button type="button" className="nav-link">Alpha</button>
                </li>
              </ul>

              <div className="searchBar custom-tabs">
                <i className="ri-search-2-line"></i>
                <input
                  type="search"
                  className="custom_search"
                  placeholder="Search Crypto"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 w-100 market-tbltabs-row">
              <MarketQuoteSelect
                value={quoteFilter}
                onChange={setQuoteFilter}
                options={QUOTE_OPTIONS}
              />
              <ul className="tbltabs market-tbltabs-list">
                {SPOT_SUBTABS.map((t) => (
                  <li key={t.key} className={subTab === t.key ? "active" : ""}>
                    <button type="button" onClick={() => setSubTab(t.key)}>{t.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card py-2">
              <div className="card-body p-0 desktoptable">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Pair</th>
                        <th>Last Price</th>
                        <th>24h Change</th>
                        <th>24h High</th>
                        <th>24h Low</th>
                        <th>24h Volume</th>
                        <th>Base Volume</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading && rows.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-5">
                            Loading live markets…
                          </td>
                        </tr>
                      ) : error && rows.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-5 text-danger">
                            Failed to load markets. Is market-data-service reachable?
                          </td>
                        </tr>
                      ) : rows.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-5">No matches</td>
                        </tr>
                      ) : (
                        rows.map((t) => {
                          const { base, quote } = splitPair(t.symbol);
                          const positive = t.priceChangePercent >= 0;
                          const tradePath = `/trade/${base}_${quote || "USDT"}`;
                          return (
                            <tr key={t.symbol}>
                              <td>
                                <div className="td_div">
                                  <span className="star_btn btn_icon">
                                    <i className="ri-star-line text-warning me-2"></i>
                                  </span>
                                  <CoinIcon base={base} />
                                  <div className="coin_info">
                                    <div className="coin_name_lft">
                                      {base}
                                      <span className="coin_symbol">/{quote}</span>
                                    </div>
                                    <span className="coin_name">
                                      {COIN_NAMES[base] || base}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="last_price">
                                  {fmtPrice(t.lastPrice)}
                                  <span className="price_value">${fmtPrice(t.lastPrice)}</span>
                                </div>
                              </td>
                              <td className={positive ? "color-green green" : "color-red text-danger"}>
                                <div className="hight_price">{fmtPct(t.priceChangePercent)}</div>
                              </td>
                              <td>{fmtPrice(t.high)}</td>
                              <td>{fmtPrice(t.low)}</td>
                              <td>
                                <div className="volume_price">{fmtShortUsd(t.quoteVolume)}</div>
                              </td>
                              <td>
                                <div className="market_cap">{fmtPrice(t.volume)}</div>
                              </td>
                              <td className="right_0">
                                <div className="btb_tbl d-flex">
                                  <Link to={tradePath} className="btn trade_btn">
                                    Trade
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Market;
