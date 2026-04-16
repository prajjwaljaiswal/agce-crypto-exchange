import React, { useEffect, useRef, useState } from "react";

const OPTIONS = ["All", "USDT", "USD1", "USDC", "GUSD"];

export default function MarketQuoteSelect({ value, onChange, options = OPTIONS }) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(options[0] ?? "All");
  const selected = value ?? internal;
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="market-quote-select" ref={rootRef}>
      <button
        type="button"
        className={`market-quote-select__trigger${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="market-quote-select__label">{selected}</span>
        <i
          className={`market-quote-select__chev ri-arrow-${open ? "up" : "down"}-s-line`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <ul className="market-quote-select__panel" role="listbox">
          {options.map((opt) => (
            <li key={opt} role="presentation">
              <button
                type="button"
                className="market-quote-select__option"
                role="option"
                aria-selected={opt === selected}
                onClick={() => {
                  if (onChange) onChange(opt);
                  else setInternal(opt);
                  setOpen(false);
                }}
              >
                <span>{opt}</span>
                {opt === selected ? (
                  <span className="market-quote-select__check" aria-hidden="true">
                    <i className="ri-check-line" aria-hidden="true" />
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
