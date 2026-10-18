import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

type OperationalRecord = {
  id: number;
  facility: string;
  date: string;
  downtimeHours: number;
  temperature: number;
  pressure: number;
  status: "Normal" | "Warning" | "Critical";
};

function Alerts() {
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

        console.error("Failed to load alerts:", error);
        setLoadError("Could not load operational alerts.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRecords();

    return () => controller.abort();
  }, []);

  const latestByFacility = new Map<string, OperationalRecord>();

  for (const record of records) {
    const existing = latestByFacility.get(record.facility);

    if (
      !existing ||
      record.date > existing.date ||
      (record.date === existing.date && record.id > existing.id)
    ) {
      latestByFacility.set(record.facility, record);
    }
  }

  const alertRecords = [...latestByFacility.values()]
    .filter((record) => record.status !== "Normal")
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.id - a.id,
    );

  const criticalCount = alertRecords.filter(
    (record) => record.status === "Critical",
  ).length;

  const warningCount = alertRecords.filter(
    (record) => record.status === "Warning",
  ).length;

  return (
    <main className="page-content">
      <div className="page-heading">
        <p className="page-eyebrow">Monitoring</p>
        <h1>Operational Alerts</h1>
        <p>
          Warning and critical statuses from each facility's latest
          stored record.
        </p>
      </div>

      {isLoading ? (
        <p className="records-message" role="status">
          Loading operational alerts...
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
          <div className="alerts-summary">
            <div>
              <span>Facilities requiring review</span>
              <strong>{alertRecords.length}</strong>
            </div>

            <div>
              <span>Critical</span>
              <strong>{criticalCount}</strong>
            </div>

            <div>
              <span>Warnings</span>
              <strong>{warningCount}</strong>
            </div>
          </div>

          {alertRecords.length === 0 ? (
            <p className="records-message">
              No warning or critical statuses in the latest facility records.
            </p>
          ) : (
            <section className="alerts-list">
              {alertRecords.map((record) => (
                <article
                  key={record.id}
                  className={`alert-card ${record.status.toLowerCase()}`}
                >
                  <div className="alert-card-header">
                    <div>
                      <p className="alert-date">{record.date}</p>
                      <h2>{record.facility}</h2>
                    </div>

                    <span
                      className={`status-badge ${record.status.toLowerCase()}`}
                    >
                      {record.status}
                    </span>
                  </div>

                  <p className="alert-message">
                    {record.status} status reported with{" "}
                    {record.downtimeHours} hours of downtime and a
                    temperature of {record.temperature} °C.
                  </p>

                  <div className="alert-metrics">
                    <span>
                      Downtime: <strong>{record.downtimeHours} h</strong>
                    </span>

                    <span>
                      Temperature: <strong>{record.temperature} °C</strong>
                    </span>

                    <span>
                      Pressure: <strong>{record.pressure} PSI</strong>
                    </span>
                  </div>

                  <Link
                    to={`/records/${record.id}`}
                    state={{ from: "/alerts" }}
                    className="facility-details-link"
                  >
                    Review record →
                  </Link>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default Alerts;