import { useState } from "react";
import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import { SecurityTable } from "../components/SecurityTable.js";
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
  const [deviceRows] = useState<DeviceRow[]>([]);

  return (
    <main className="slg-page" aria-labelledby="adv-title">
      <SecurityBreadcrumb label="Authorized devices" />

      <div className="security_section_bl">
        <h1 id="adv-title" className="slg-page__title">
          Authorized devices
        </h1>
        <p className="slg-page__sub">Manage and review devices that are authorized to access your account.</p>

        <SecurityTable
          columns={DEVICE_COLUMNS}
          rows={deviceRows}
          renderCells={(row) => [row.device, row.loginTime, row.ip, row.place, row.deviceType, row.actions]}
          getRowKey={(row, idx) => row.id ?? idx}
        />
      </div>
    </main>
  );
};

export default AuthorizedDevices;
