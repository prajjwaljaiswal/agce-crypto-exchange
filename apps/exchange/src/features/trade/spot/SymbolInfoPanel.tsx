import { useState } from 'react'
import { CoinIcon, COIN_NAMES } from './coins.js'
import { useCoinInfo, useTradingParams } from './hooks.js'
import { fmtUsdCompact, fmtSupply, fmtDate, parseBase } from './format.js'

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 gap-2">
      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
      <div className="text-xs font-medium text-right" style={{ color: 'var(--color-text)' }}>{children}</div>
    </div>
  )
}

export function SymbolInfoPanel({ symbol }: { symbol: string }) {
  const [innerTab, setInnerTab] = useState<'info' | 'params'>('info')
  const base = parseBase(symbol)
  const { info, loading, error } = useCoinInfo(base)
  const params = useTradingParams(symbol)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--color-surface)' }}>
      {/* Secondary toggle — outer Chart row already has "Info" */}
      <div className="flex items-center justify-end gap-2 px-5 h-10 shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <button
          className="text-xs font-medium px-3 py-1 rounded"
          style={{
            color: innerTab === 'info' ? 'var(--color-text)' : 'var(--color-text-muted)',
            background: innerTab === 'info' ? 'var(--color-surface-2)' : 'transparent',
          }}
          onClick={() => setInnerTab('info')}
        >
          Overview
        </button>
        <button
          className="text-xs font-medium px-3 py-1 rounded"
          style={{
            color: innerTab === 'params' ? 'var(--color-text)' : 'var(--color-text-muted)',
            background: innerTab === 'params' ? 'var(--color-surface-2)' : 'transparent',
          }}
          onClick={() => setInnerTab('params')}
        >
          Trading Parameters
        </button>
      </div>

      {innerTab === 'info' ? (
        <div className="px-5 py-4">
          {/* Header: coin name + feedback */}
          <div className="flex justify-between items-center w-full mb-4">
            <div className="flex items-center gap-2">
              <CoinIcon symbol={base} size={20} />
              <div className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                {info?.name ?? COIN_NAMES[base] ?? base}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Found an issue?</div>
              <button className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Submit Feedback</button>
            </div>
          </div>

          {loading && !info && (
            <div className="text-xs py-6" style={{ color: 'var(--color-text-muted)' }}>Loading market info…</div>
          )}
          {error && !info && (
            <div className="text-xs py-6" style={{ color: 'var(--color-text-muted)' }}>
              Market info unavailable for {base}.
            </div>
          )}

          {info && (
            <div className="flex flex-wrap gap-x-12 gap-y-8">
              {/* Left column: stats */}
              <div className="w-full md:w-[40%] md:flex-auto">
                <InfoRow label="Rank">
                  <div className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-primary)' }}>
                      <path d="M12 1.672L14.828 4.5 12 7.33 9.17 4.5zM15.128 8.1a1.4 1.4 0 011.4 1.4v2.1h4.57a1.4 1.4 0 011.4 1.4v8a1.4 1.4 0 01-1.4 1.4H2.95a1.4 1.4 0 01-1.4-1.4v-5a1.4 1.4 0 011.4-1.4h4.777V9.5a1.4 1.4 0 011.4-1.4h6zm1.4 12.5h4.17v-7.2h-4.17v7.2zM3.352 16.4v4.2h4.376v-4.2H3.352zm6.176 4.2h5.2V9.9h-5.2v10.7z"/>
                    </svg>
                    <span>No. {info.rank ?? '—'}</span>
                  </div>
                </InfoRow>
                <InfoRow label="Market Capitalization">{fmtUsdCompact(info.marketCap)}</InfoRow>
                <InfoRow label="Fully Diluted Market Cap">{fmtUsdCompact(info.fdv)}</InfoRow>
                <InfoRow label="Volume (24h)">{fmtUsdCompact(info.volume24h)}</InfoRow>
                <InfoRow label="Volume / Market Cap">
                  {info.volume24h && info.marketCap ? `${((info.volume24h / info.marketCap) * 100).toFixed(2)}%` : '—'}
                </InfoRow>
                <InfoRow label="Circulating Supply">{fmtSupply(info.circulating, info.symbol)}</InfoRow>
                <InfoRow label="Maximum Supply">
                  {info.maxSupply == null
                    ? <span>∞ {info.symbol}</span>
                    : fmtSupply(info.maxSupply, info.symbol)}
                </InfoRow>
                <InfoRow label="Total Supply">{fmtSupply(info.totalSupply, info.symbol)}</InfoRow>
                <InfoRow label="Issue Date">{fmtDate(info.genesisDate)}</InfoRow>
                <InfoRow label="Historical High">
                  <div>
                    <div>{info.ath != null ? `$${info.ath.toLocaleString('en-US', { maximumFractionDigits: 6 })}` : '—'}</div>
                    <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{fmtDate(info.athDate)}</div>
                  </div>
                </InfoRow>
                <InfoRow label="Historical Low">
                  <div>
                    <div>{info.atl != null ? `$${info.atl.toLocaleString('en-US', { maximumFractionDigits: 6 })}` : '—'}</div>
                    <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{fmtDate(info.atlDate)}</div>
                  </div>
                </InfoRow>
              </div>

              {/* Right column: links */}
              <div className="w-full md:w-[40%] md:flex-auto">
                <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Links</div>
                {info.homepage && (
                  <div className="flex justify-between items-center py-2">
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Website</div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <a href={info.homepage} target="_blank" rel="noreferrer" className="text-xs font-medium px-2 py-1 rounded no-underline" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}>
                        Official Website
                      </a>
                      {info.whitepaper && (
                        <a href={info.whitepaper} target="_blank" rel="noreferrer" className="text-xs font-medium px-2 py-1 rounded no-underline" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}>
                          Whitepaper
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {info.explorer && (
                  <div className="flex justify-between items-center py-2">
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Block Explorer</div>
                    <a href={info.explorer} target="_blank" rel="noreferrer" className="text-xs font-medium px-2 py-1 rounded no-underline" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}>
                      {new URL(info.explorer).hostname}
                    </a>
                  </div>
                )}

                {info.description && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center pb-2">
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Intro</div>
                    </div>
                    <div
                      className="text-xs leading-relaxed"
                      style={{
                        color: 'var(--color-text)',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: expanded ? undefined : 3,
                        overflow: 'hidden',
                      }}
                      dangerouslySetInnerHTML={{ __html: info.description }}
                    />
                    <button
                      className="text-xs mt-1 flex items-center gap-0.5"
                      style={{ color: 'var(--color-primary)' }}
                      onClick={() => setExpanded(e => !e)}
                    >
                      {expanded ? 'Collapse' : 'Unfold'}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ transform: expanded ? 'rotate(-90deg)' : 'rotate(90deg)' }}>
                        <path d="M15.698 12.568a.9.9 0 00-.061-1.205l-6-6a.9.9 0 00-1.266 1.266l.061.069L13.727 12l-5.364 5.363a.9.9 0 001.274 1.274l6-6 .061-.069z"/>
                      </svg>
                    </button>
                  </div>
                )}

                <div className="text-[10px] mt-8 flex items-start gap-1" style={{ color: 'var(--color-text-muted)' }}>
                  <span>*</span>
                  <span>Underlying data is sourced from CoinGecko and is for reference only.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="px-5 py-4">
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Trading Parameters</div>
          {!params ? (
            <div className="text-xs py-6" style={{ color: 'var(--color-text-muted)' }}>Loading trading parameters…</div>
          ) : (
            <div className="max-w-md">
              <InfoRow label="Symbol">{params.symbol}</InfoRow>
              <InfoRow label="Base Asset">{params.baseAsset}</InfoRow>
              <InfoRow label="Quote Asset">{params.quoteAsset}</InfoRow>
              <InfoRow label="Status">{params.status}</InfoRow>
              <InfoRow label="Price Tick Size">{params.tickSize}</InfoRow>
              <InfoRow label="Qty Step Size">{params.stepSize}</InfoRow>
              <InfoRow label="Min Qty">{params.minQty}</InfoRow>
              <InfoRow label="Max Qty">{params.maxQty}</InfoRow>
              <InfoRow label="Min Notional">{params.minNotional}</InfoRow>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
