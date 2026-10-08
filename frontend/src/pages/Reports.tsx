import { operationalRecords } from "../data/operationalRecords";

function Reports() {
  const totalProduction = operationalRecords.reduce(
    (total, record) => total + record.production,
    0,
  );

  const totalDowntime = operationalRecords.reduce(
    (total, record) => total + record.downtimeHours,
    0,
  );

  const averageProduction = Math.round(
    totalProduction / operationalRecords.length,
  );

  const bestPerformingRecord = operationalRecords.reduce(
    (highest, record) =>
      record.production > highest.production ? record : highest,
  );

  const facilitiesRequiringAttention = operationalRecords.filter(
    (record) => record.status !== "Normal",
  ).length;

  function handleDownloadReport() {
    const headers = [
      "Facility",
      "Date",
      "Production (MWh)",
      "Operating Hours",
      "Downtime Hours",
      "Status",
    ];

    const rows = operationalRecords.map((record) => [
      record.facility,
      record.date,
      record.production,
      record.operatingHours,
      record.downtimeHours,
      record.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const file = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "energypulse-operational-report.csv";
    link.click();

    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <main className="page-content">
      <div className="reports-heading">
        <div className="page-heading">
          <p className="page-eyebrow">Analytics</p>
          <h1>Operational Reports</h1>
          <p>
            Review production, downtime, and facility performance.
          </p>
        </div>

        <button
          type="button"
          className="report-download-button"
          onClick={handleDownloadReport}
        >
          Download Report
        </button>
      </div>

      <section className="report-summary-grid">
        <article className="report-summary-card">
          <span>Total production</span>
          <strong>{totalProduction.toLocaleString()} MWh</strong>
          <small>Across all facility records</small>
        </article>

        <article className="report-summary-card">
          <span>Average production</span>
          <strong>{averageProduction.toLocaleString()} MWh</strong>
          <small>Average per facility record</small>
        </article>

        <article className="report-summary-card">
          <span>Total downtime</span>
          <strong>{totalDowntime} h</strong>
          <small>Combined reported downtime</small>
        </article>

        <article className="report-summary-card">
          <span>Facilities requiring attention</span>
          <strong>{facilitiesRequiringAttention}</strong>
          <small>Warning or Critical status</small>
        </article>
      </section>

      <section className="performance-report">
        <div className="report-section-heading">
          <div>
            <p className="page-eyebrow">Performance</p>
            <h2>Facility comparison</h2>
          </div>

          <p>
            Highest production:{" "}
            <strong>{bestPerformingRecord.facility}</strong>
          </p>
        </div>

        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Facility</th>
                <th>Production</th>
                <th>Downtime</th>
                <th>Operating Hours</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {operationalRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.facility}</td>
                  <td>{record.production.toLocaleString()} MWh</td>
                  <td>{record.downtimeHours} h</td>
                  <td>{record.operatingHours} h</td>
                  <td>
                    <span
                      className={`status-badge ${record.status.toLowerCase()}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Reports;