type TokenInfoTabProps = {
    SelectedCoin: any;
    desAndLinks: {
        description?: string;
        links?: any[];
        total_supply?: any;
        circulating_supply?: any;
        issueDate?: any;
        [key: string]: any;
    };
};

export function TokenInfoTab({ SelectedCoin, desAndLinks }: TokenInfoTabProps) {
    return (
        <div className="inf_row scroll_y">
            <div className="headline_symbolName__KfmIZ mt_tr_pr cursor-pointer">
                <div className="headline_bigName__dspVW me-2">
                    <img alt="" src={SelectedCoin?.icon_path} width="24" className="img-fluid round_img" />
                </div>
                <div>
                    <div className="headline_bigName__dspVW">
                        <h1>{SelectedCoin?.base_currency_fullname || "N/A"}<i className="ri-arrow-down-s-fill"></i></h1>
                    </div>
                </div>
            </div>
            <div className="row g-2 g-md-4">
                <div className="col-lg-6">
                    <ul className="infor_row">
                        <li>
                            Total Supply <span>{desAndLinks?.total_supply || "N/A"}</span>
                        </li>
                        <li>
                            Circulating Supply <span>{desAndLinks?.circulating_supply || "N/A"}</span>
                        </li>
                        <li>
                            Volume <span>{SelectedCoin?.volumeQuote?.toFixed(2) || "N/A"} {SelectedCoin?.quote_currency || "N/A"}</span>
                        </li>
                        <li>
                            Issue Date <span>{desAndLinks?.issueDate || "N/A"}</span>
                        </li>
                        {(desAndLinks?.links?.length ?? 0) > 0 && desAndLinks?.links?.map((item: any, idx: number) => (
                            <li key={idx}>
                                <a href={item?.description} target="_blank" rel="noreferrer">{item?.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-lg-6 t_info">
                    <h5>Information</h5>
                    <p>{desAndLinks?.description || ""}</p>
                </div>
            </div>
        </div>
    );
}
