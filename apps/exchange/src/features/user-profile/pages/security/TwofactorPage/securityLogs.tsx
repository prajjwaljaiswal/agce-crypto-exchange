import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./securityLogs.css";

const TAB_LOGINS = "logins";
const TAB_SETTINGS = "settings";

type Tab = typeof TAB_LOGINS | typeof TAB_SETTINGS;

const LOGIN_COLUMNS = ["Type", "Time", "Status", "IP", "Login Location"];
const SETTINGS_COLUMNS = ["Type", "Time", "IP", "Actions"];

interface LoginRow {
  id?: string | number;
  type?: React.ReactNode;
  time?: React.ReactNode;
  status?: React.ReactNode;
  ip?: React.ReactNode;
  location?: React.ReactNode;
}

interface SettingsRow {
  id?: string | number;
  type?: React.ReactNode;
  time?: React.ReactNode;
  ip?: React.ReactNode;
  actions?: React.ReactNode;
}

const SecurityLogs = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>(TAB_LOGINS);

  const [loginRows] = useState<LoginRow[]>([]);
  const [settingsRows] = useState<SettingsRow[]>([]);

  const { columns, rows } = useMemo(() => {
    if (tab === TAB_LOGINS) {
      return { columns: LOGIN_COLUMNS, rows: loginRows as (LoginRow | SettingsRow)[] };
    }
    return { columns: SETTINGS_COLUMNS, rows: settingsRows as (LoginRow | SettingsRow)[] };
  }, [tab, loginRows, settingsRows]);

  const colCount = columns.length;
  const isEmpty = rows.length === 0;

  return (
    <main className="slg-page" aria-labelledby="slg-title">
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
            Security Logs
          </li>
        </ol>
      </nav>

      <div className="security_section_bl">
        <h1 id="slg-title" className="slg-page__title">
          Security Logs
        </h1>

        <div className="slg-tabs" role="tablist" aria-label="Log type">
          <button
            type="button"
            role="tab"
            aria-selected={tab === TAB_LOGINS}
            id="slg-tab-logins"
            aria-controls="slg-panel"
            className={`slg-tab ${tab === TAB_LOGINS ? "is-active" : ""}`}
            onClick={() => setTab(TAB_LOGINS)}
          >
            Logins History
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === TAB_SETTINGS}
            id="slg-tab-settings"
            aria-controls="slg-panel"
            className={`slg-tab ${tab === TAB_SETTINGS ? "is-active" : ""}`}
            onClick={() => setTab(TAB_SETTINGS)}
          >
            Security Settings History
          </button>
        </div>

        <div id="slg-panel" role="tabpanel" aria-labelledby={tab === TAB_LOGINS ? "slg-tab-logins" : "slg-tab-settings"} className="slg-tableWrap">
          <div className="slg-tableScroll">
            <table className="slg-table">
              <thead>
                <tr>
                  {columns.map((label) => (
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
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => {
                    const cells =
                      tab === TAB_LOGINS
                        ? [(row as LoginRow).type, (row as LoginRow).time, (row as LoginRow).status, (row as LoginRow).ip, (row as LoginRow).location]
                        : [(row as SettingsRow).type, (row as SettingsRow).time, (row as SettingsRow).ip, (row as SettingsRow).actions];
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

export default SecurityLogs;
