import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserProfileOrdersSegment, getUserProfileSegment } from "./userProfileSidebarMode.js";
import "./order-sidebar.css";

type SectionKey = "spotOrder" | "futuresOrders" | "perpetual" | "delivery" | "optionsOrder" | "assetHist";

type OpenState = Record<SectionKey, boolean>;

interface OrderSidebarProps {
  toggleContent?: (label: string) => void;
}

const initialOpenState: OpenState = {
  spotOrder: false,
  futuresOrders: false,
  perpetual: false,
  delivery: false,
  optionsOrder: false,
  assetHist: false,
};

/**
 * Orders-only sidebar (spot, futures tree, convert, launchpad, etc.).
 */
export default function OrderSidebar({ toggleContent }: OrderSidebarProps) {
  const location = useLocation();
  const topSeg = getUserProfileSegment(location.pathname);
  const seg = topSeg === "orders" ? getUserProfileOrdersSegment(location.pathname) : topSeg;

  const [open, setOpen] = useState<OpenState>(initialOpenState);

  useEffect(() => {
    const top = getUserProfileSegment(location.pathname);
    const s = top === "orders" ? getUserProfileOrdersSegment(location.pathname) : top;
    const isOrdersRoot = top === "orders" && !s;
    const spotOrderOpen =
      isOrdersRoot ||
      s === "spot_orders" ||
      s === "spot_order_history" ||
      s === "spot_position_history" ||
      s === "spot_open_orders" ||
      s === "trade_history";
    const perpetualActive =
      s === "futures_open_orders" ||
      s === "futures_order_history" ||
      s === "position_orders" ||
      s === "position_history" ||
      s === "futures_trade_history";
    const futuresOrdersOpen =
      perpetualActive ||
      (s && s.startsWith("futures_")) ||
      s === "position_orders" ||
      s === "position_history" ||
      s === "options_open_orders" ||
      s === "options_order_history" ||
      s === "options_trade_history" ||
      s === "options_position_history";
    const assetHistOpen =
      s === "transaction_history" ||
      s === "deposit_history" ||
      s === "withdraw_history" ||
      s === "transfer" ||
      s === "referral" ||
      s === "swap_history" ||
      s === "wallet_transfer_History";

    setOpen({
      spotOrder: spotOrderOpen,
      futuresOrders: futuresOrdersOpen,
      perpetual: perpetualActive,
      delivery: false,
      optionsOrder:
        s === "options_open_orders" ||
        s === "options_order_history" ||
        s === "options_trade_history" ||
        s === "options_position_history",
      assetHist: assetHistOpen,
    });
  }, [location.pathname]);

  const toggle = (key: SectionKey) => {
    setOpen((o) => {
      const nextValue = !o[key];
      if (!nextValue) return { ...o, [key]: false };

      // Accordion: opening one closes others.
      // Nested: opening Perpetual/OptionsOrder also keeps Future open.
      if (key === "spotOrder") {
        return { ...initialOpenState, spotOrder: true };
      }
      if (key === "assetHist") {
        return { ...initialOpenState, assetHist: true };
      }
      if (key === "futuresOrders") {
        return { ...initialOpenState, futuresOrders: true };
      }
      if (key === "perpetual") {
        return { ...initialOpenState, futuresOrders: true, perpetual: true };
      }
      if (key === "optionsOrder") {
        return { ...initialOpenState, futuresOrders: true, optionsOrder: true };
      }

      return { ...initialOpenState, [key]: true };
    });
  };

  const fire = (label: string) => () => toggleContent?.(label);

  const liActive = (segment: string) => (seg === segment ? "active mb-1" : "mb-1");

  const futuresSectionActive =
    (seg && seg.startsWith("futures_")) || seg === "position_orders" || seg === "position_history";

  const spotOrderSectionActive =
    seg === "spot_orders" ||
    seg === "spot_order_history" ||
    seg === "spot_position_history" ||
    seg === "spot_open_orders" ||
    seg === "trade_history";

  return (
    <ul className="list-unstyled ps-0 navi_sidebar order-sidebar-root">
      <li className="mb-1 order-sidebar-deep">
        <button
          type="button"
          className="btn btn-toggle collapsed"
          onClick={() => toggle("spotOrder")}
        >
          <img className="navi_sidebar_icon" src="/images/ordersidebar_menu_icon.svg" alt="Spot" width={20} height={20} />
          <div className={`dashboard_menu_hd ${spotOrderSectionActive ? "active_ul" : ""}`}>Spot Order</div>
          <span>
            <i className={open.spotOrder ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} aria-hidden="true" />
          </span>
        </button>
        <div className={`collapse ${open.spotOrder ? "show" : ""}`}>
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className={liActive("spot_orders")} onClick={fire("Spot Order")}>
              <Link to="/user_profile/orders/spot_orders" className="rounded">
               Open Orders
              </Link>
            </li>
            <li className={liActive("spot_order_history")} onClick={fire("Spot Order History")}>
              <Link to="/user_profile/orders/spot_order_history" className="rounded">
                Order History
              </Link>
            </li>
             <li className={liActive("trade_history")} onClick={fire("Trade History")}>
              <Link to="/user_profile/orders/trade_history" className="rounded">
               Trade History
              </Link>
            </li>
            {/* <li className={liActive("spot_position_history")} onClick={fire("Spot Position History")}>
              <Link to="/user_profile/orders/spot_position_history" className="rounded">
               Position History
              </Link>
            </li> */}
          </ul>
        </div>
      </li>





      <li className="mb-1 order-sidebar-deep">
        <button
          type="button"
          className="btn btn-toggle collapsed"
          onClick={() => toggle("assetHist")}
        >
          <img className="navi_sidebar_icon" src="/images/ordersidebar_menu_icon11.svg" alt="History" width={20} height={20} />
          <div
            className={`dashboard_menu_hd ${
              seg === "transaction_history" ||
              seg === "deposit_history" ||
              seg === "withdraw_history" ||
              seg === "transfer" ||
              seg === "referral" ||
              seg === "swap_history" ||
              seg === "wallet_transfer_History"
                ? "active_ul"
                : ""
            }`}
          >
            Asset History
          </div>
          <span>
            <i
              className={
                open.assetHist ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
              }
              aria-hidden="true"
            />
          </span>
        </button>
        <div className={`collapse ${open.assetHist ? "show" : ""}`}>
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className={liActive("deposit_history")} onClick={fire("Deposit History")}>
              <Link to="/user_profile/orders/deposit_history" className="rounded">
                Deposit
              </Link>
            </li>
            <li className={liActive("withdraw_history")} onClick={fire("Withdraw History")}>
              <Link to="/user_profile/orders/withdraw_history" className="rounded">
                Withdraw
              </Link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  );
}
