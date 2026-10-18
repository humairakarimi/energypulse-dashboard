import { useEffect, useState } from "react";
import { API_URL } from "../config";

type OperationalRecord = {
  id: number;
  facility: string;
  date: string;
  production: number;
  operatingHours: number;
  downtimeHours: number;
  status: "Normal" | "Warning" | "Critical";
};

type FacilitySummary = {
  facility: string;
  production: number;
  operatingHours: number;
  downtimeHours: number;
  latest: OperationalRecord;
};

function Reports() {
  const [records, setRecords] = useState<OperationalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecords() {
      try {
        const response = await fetch(
          `${API_URL.replace(/\/+$/, "")}/api/records`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("The records request failed.");
        }

        const data: OperationalRecord[] = await response.json();
        setRecords(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Failed to load reports:", error);
        setLoadError("Could not load operational reports.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRecords();

    return () => controller.abort();
  }, []);

  const totalProduction = records.reduce(
    (total, record) => total + record.production,
    0,
  );

  const totalDowntime = records.reduce(
    (total, record) => total + record.downtimeHours,
    0,
  );

  const averageProduction =
    records.length > 0 ? totalProduction / records.length : 0;

  const byFacility = new Map<string, FacilitySummary>();

  for (const record of records) {
    const summary = byFacility.get(record.facility);

    if (!summary) {
      byFacility.set(record.facility, {
        facility: record.facility,
        production: record.production,
        operatingHours: record.operatingHours,
        downtimeHours: record.downtimeHours,
        latest: record,
      });
      continue;
    }

    summary.production += record.production;
    summary.operatingHours += record.operatingHours;
    summary.downtimeHours += record.downtimeHours;

    if (
      record.date > summary.latest.date ||
      (record.date === summary.latest.date &&
        record.id > summary.latest.id)
    ) {
      summary.latest = record;
    }
  }

  const facilities = [...byFacility.values()].sort(
    (a, b) =>
      b.production - a.production ||
      a.facility.localeCompare(b.facility),
  );

  const facilitiesRequiringAttention = facilities.filter(
    (facility) => facility.latest.status !== "Normal",
  ).length;

  function handleDownloadReport() {
    if (isLoading || loadError || records.length === 0) return;

    const headers = [
      "Facility",
      "Date",
      "Production (MWh)",
      "Operating Hours",
      "Downtime Hours",
      "Status",
    ];

    const rows = records.map((record) => [
      record.facility,
      record.date,
      record.production,
      record.operatingHours,
      record.downtimeHours,
      record.status,
    ]);

    function csvCell(value: string | number) {
      let text = String(value);

      // Keep spreadsheet apps from interpreting text as formulas.
      if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) {
        text = `'${text}`;
      }

      return `"${text.replace(/"/g, '""')}"`;
    }

    const csvContent = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");

    const file = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "energypulse-operational-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }

  return (
    <main className="page-content">
      <div className="reports-heading">
        <div className="page-heading">
          <p className="page-eyebrow">Analytics</p>
          <h1>Operational Reports</h1>
          <p>Review production and downtime across all stored records.</p>
        </div>

        <button
          type="button"
          className="report-download-button"
          onClick={handleDownloadReport}
          disabled={isLoading || Boolean(loadError) || records.length === 0}
        >
          Download Report
        </button>
      </div>

      {isLoading ? (
        <p className="records-message" role="status">
          Loading operational reports...
        </p>
      ) : loadError ? (
        <p className="records-message records-error" role="alert">
          {loadError}
        </p>
      ) : records.length === 0 ? (
        <p className="records-message">
          No operational records available.
        </p>
      ) : (
        <>
          <section className="report-summary-grid">
            <article className="report-summary-card">
              <span>Total production</span>
              <strong>{totalProduction.toLocaleString()} MWh</strong>
              <small>Across all stored records</small>
            </article>

            <article className="report-summary-card">
              <span>Average production</span>
              <strong>
                {averageProduction.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })} MWh
              </strong>
              <small>Average per facility record</small>
            </article>

            <article className="report-summary-card">
              <span>Total downtime</span>
              <strong>{totalDowntime.toLocaleString()} h</strong>
              <small>Across all stored records</small>
            </article>

            <article className="report-summary-card">
              <span>Facilities requiring attention</span>
              <strong>{facilitiesRequiringAttention}</strong>
              <small>Based on each facility's latest record</small>
            </article>
          </section>

          <section className="performance-report">
            <div className="report-section-heading">
              <div>
                <p className="page-eyebrow">Performance</p>
                <h2>Facility comparison</h2>
                <p>Totals across all stored records; status from latest record.</p>
              </div>

              <p>
                Highest total production:{" "}
                <strong>{facilities[0]?.facility}</strong>
              </p>
            </div>

            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Facility</th>
                    <th>Total Production</th>
                    <th>Total Downtime</th>
                    <th>Total Operating Hours</th>
                    <th>Latest Status</th>
                  </tr>
                </thead>

                <tbody>
                  {facilities.map((facility) => (
                    <tr key={facility.facility}>
                      <td>{facility.facility}</td>
                      <td>{facility.production.toLocaleString()} MWh</td>
                      <td>{facility.downtimeHours.toLocaleString()} h</td>
                      <td>{facility.operatingHours.toLocaleString()} h</td>
                      <td>
                        <span
                          className={`status-badge ${facility.latest.status.toLowerCase()}`}
                        >
                          {facility.latest.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Reports;