import { useState } from "react";
import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import { SecurityTable } from "../components/SecurityTable.js";
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
  const [tab, setTab] = useState<Tab>(TAB_LOGINS);

  const [loginRows] = useState<LoginRow[]>([]);
  const [settingsRows] = useState<SettingsRow[]>([]);

  return (
    <main className="slg-page" aria-labelledby="slg-title">
      <SecurityBreadcrumb label="Security Logs" />

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

        <div
          id="slg-panel"
          role="tabpanel"
          aria-labelledby={tab === TAB_LOGINS ? "slg-tab-logins" : "slg-tab-settings"}
        >
          {tab === TAB_LOGINS ? (
            <SecurityTable
              columns={LOGIN_COLUMNS}
              rows={loginRows}
              renderCells={(row) => [row.type, row.time, row.status, row.ip, row.location]}
              getRowKey={(row, idx) => row.id ?? idx}
            />
          ) : (
            <SecurityTable
              columns={SETTINGS_COLUMNS}
              rows={settingsRows}
              renderCells={(row) => [row.type, row.time, row.ip, row.actions]}
              getRowKey={(row, idx) => row.id ?? idx}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default SecurityLogs;
