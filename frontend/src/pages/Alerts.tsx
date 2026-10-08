import { Link } from "react-router-dom";
import { operationalRecords } from "../data/operationalRecords";

function Alerts() {
  const alertRecords = operationalRecords.filter(
    (record) => record.status !== "Normal",
  );

  function getAlertMessage(
    status: string,
    downtime: number,
    temperature: number,
  ) {
    if (status === "Critical") {
      return `Critical operating conditions detected with ${downtime} hours of downtime and a temperature of ${temperature} °C.`;
    }

    return `Operational performance requires attention. Current downtime is ${downtime} hours and temperature is ${temperature} °C.`;
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <p className="page-eyebrow">Monitoring</p>
        <h1>Operational Alerts</h1>
        <p>
          Review facilities currently reporting warning or critical operating
          conditions.
        </p>
      </div>

      <div className="alerts-summary">
        <div>
          <span>Total active alerts</span>
          <strong>{alertRecords.length}</strong>
        </div>

        <div>
          <span>Critical</span>
          <strong>
            {
              alertRecords.filter(
                (record) => record.status === "Critical",
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Warnings</span>
          <strong>
            {
              alertRecords.filter(
                (record) => record.status === "Warning",
              ).length
            }
          </strong>
        </div>
      </div>

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
              {getAlertMessage(
                record.status,
                record.downtimeHours,
                record.temperature,
              )}
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
              className="facility-details-link"
            >
              Review record →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Alerts;