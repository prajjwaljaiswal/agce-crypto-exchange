import { useQuery } from '@tanstack/react-query'
import { assetsApi } from '../../../../lib/matching-api.js'

type TokenInfoTabProps = {
    SelectedCoin: any
}

export function TokenInfoTab({ SelectedCoin }: TokenInfoTabProps) {
    const baseCurrency: string | undefined = SelectedCoin?.base_currency

    const { data: asset, isLoading, isError } = useQuery({
        queryKey: ['asset', baseCurrency],
        queryFn: ({ signal }) => assetsApi.get(baseCurrency!, signal),
        enabled: Boolean(baseCurrency),
        staleTime: 5 * 60 * 1000,
    })

    return (
        <div className="inf_row scroll_y">
            <div className="headline_symbolName__KfmIZ mt_tr_pr cursor-pointer">
                <div className="headline_bigName__dspVW me-2">
                    <img
                        alt=""
                        src={asset?.iconUrl ?? SelectedCoin?.icon_path}
                        width="24"
                        className="img-fluid round_img"
                    />
                </div>
                <div>
                    <div className="headline_bigName__dspVW">
                        <h1>
                            {asset?.name ?? SelectedCoin?.base_currency_fullname ?? 'N/A'}
                            <i className="ri-arrow-down-s-fill" />
                        </h1>
                    </div>
                </div>
            </div>

            {isLoading && (
                <p className="text-muted small mt-2">Loading asset info…</p>
            )}
            {isError && (
                <p className="text-danger small mt-2">Failed to load asset info.</p>
            )}

            {!isLoading && (
                <div className="row g-2 g-md-4">
                    <div className="col-lg-6">
                        <ul className="infor_row">
                            <li>
                                Total Supply{' '}
                                <span>{asset?.totalSupply ?? 'N/A'}</span>
                            </li>
                            <li>
                                Circulating Supply{' '}
                                <span>{asset?.circulatingSupply ?? 'N/A'}</span>
                            </li>
                            <li>
                                Volume{' '}
                                <span>
                                    {SelectedCoin?.volumeQuote?.toFixed(2) ?? 'N/A'}{' '}
                                    {SelectedCoin?.quote_currency ?? 'N/A'}
                                </span>
                            </li>
                            {asset?.issueDate && (
                                <li>
                                    Issue Date <span>{asset.issueDate}</span>
                                </li>
                            )}
                            {(asset?.makerFee != null || asset?.takerFee != null) && (
                                <li>
                                    Fees{' '}
                                    <span>
                                        Maker {asset?.makerFee ?? '—'}% / Taker {asset?.takerFee ?? '—'}%
                                    </span>
                                </li>
                            )}
                            {(asset?.links?.length ?? 0) > 0 &&
                                asset!.links!.map((link, idx) => (
                                    <li key={idx}>
                                        <a href={link.url} target="_blank" rel="noreferrer">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className="col-lg-6 t_info">
                        <h5>Information</h5>
                        <p>{asset?.description ?? ''}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
