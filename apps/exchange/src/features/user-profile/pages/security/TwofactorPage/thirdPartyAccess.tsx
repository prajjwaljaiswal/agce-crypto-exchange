import { useState } from "react";
import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import { SecurityTable } from "../components/SecurityTable.js";
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
  const [rows] = useState<TpaRow[]>([]);

  return (
    <main className="slg-page" aria-labelledby="tpa-title">
      <SecurityBreadcrumb label="Third Party Account Access Management" />

      <div className="security_section_bl">
        <h1 id="tpa-title" className="slg-page__title">
          Third Party Account Access Management
        </h1>

        <SecurityTable
          columns={TPA_COLUMNS}
          rows={rows}
          renderCells={(row) => [row.thirdParty, row.account, row.addedAt, row.operation]}
          getRowKey={(row, idx) => row.id ?? idx}
          emptyLabel="No data"
        />
      </div>
    </main>
  );
};

export default ThirdPartyAccess;
