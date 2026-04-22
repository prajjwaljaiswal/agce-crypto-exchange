import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./securityLogs.css";

const DEVICE_COLUMNS = ["Devices", "Login time", "IP address", "Login place", "Device Type", "Actions"];

interface DeviceRow {
  id?: string | number;
  device?: React.ReactNode;
  loginTime?: React.ReactNode;
  ip?: React.ReactNode;
  place?: React.ReactNode;
  deviceType?: React.ReactNode;
  actions?: React.ReactNode;
}

const AuthorizedDevices = () => {
  const navigate = useNavigate();
  const [deviceRows] = useState<DeviceRow[]>([]);

  const isEmpty = deviceRows.length === 0;
  const colCount = DEVICE_COLUMNS.length;

  return (
    <main className="slg-page" aria-labelledby="adv-title">
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
            Authorized devices
          </li>
        </ol>
      </nav>

      <div className="security_section_bl">
        <h1 id="adv-title" className="slg-page__title">
          Authorized devices
        </h1>
        <p className="slg-page__sub">Manage and review devices that are authorized to access your account.</p>

        <div className="slg-tableWrap">
          <div className="slg-tableScroll">
            <table className="slg-table">
              <thead>
                <tr>
                  {DEVICE_COLUMNS.map((label) => (
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
                  deviceRows.map((row, idx) => {
                    const cells = [row.device, row.loginTime, row.ip, row.place, row.deviceType, row.actions];
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

export default AuthorizedDevices;
