import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./securityLogs.css";

const TPA_COLUMNS = ["Third Party", "Account", "Added at", "Operation"];

interface TpaRow {
  id?: string | number;
  thirdParty?: React.ReactNode;
  account?: React.ReactNode;
  addedAt?: React.ReactNode;
  operation?: React.ReactNode;
}

const ThirdPartyAccess = () => {
  const navigate = useNavigate();
  const [rows] = useState<TpaRow[]>([]);

  const isEmpty = rows.length === 0;
  const colCount = TPA_COLUMNS.length;

  return (
    <main className="slg-page" aria-labelledby="tpa-title">
      <nav className="slg-page__crumbs" aria-label="Breadcrumb">
        <ol className="slg-page__crumbList">
          <li className="slg-page__crumbItem">
            <button type="button" className="slg-page__crumbLink" onClick={() => navigate("/user_profile/security")}>
              Security
            </button>
          </li>
          <li className="slg-page__crumbSep" aria-hidden="true">
            ›
          </li>
          <li className="slg-page__crumbItem slg-page__crumbItem--active" aria-current="page">
            Third Party Account Access Management
          </li>
        </ol>
      </nav>

      <div className="security_section_bl">
        <h1 id="tpa-title" className="slg-page__title">
          Third Party Account Access Management
        </h1>

        <div className="slg-tableWrap">
          <div className="slg-tableScroll">
            <table className="slg-table">
              <thead>
                <tr>
                  {TPA_COLUMNS.map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isEmpty ? (
                  <tr className="slg-table__emptyRow">
                    <td colSpan={colCount}>
                      <div className="slg-empty" aria-live="polite">
                        <img
                          src="/images/no-data.svg"
                          alt=""
                          width={120}
                          height={144}
                          className="spot_orders_empty_telescope"
                        />
                        <p className="slg-empty__text">No data</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => {
                    const cells = [row.thirdParty, row.account, row.addedAt, row.operation];
                    return (
                      <tr key={row.id ?? idx}>
                        {cells.map((cell, i) => (
                          <td key={i}>{cell}</td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThirdPartyAccess;
