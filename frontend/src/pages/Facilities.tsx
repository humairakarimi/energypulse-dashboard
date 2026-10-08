import { Link } from "react-router-dom";
import { operationalRecords } from "../data/operationalRecords";

function Facilities() {
  return (
    <main className="page-content">
      <div className="page-heading">
        <p className="page-eyebrow">Operations</p>
        <h1>Facilities</h1>
        <p>
          Review the latest production and operational status for each facility.
        </p>
      </div>

      <section className="facilities-grid">
        {operationalRecords.map((record) => (
          <article className="facility-card" key={record.id}>
            <div className="facility-card-header">
              <div>
                <p className="facility-label">Facility</p>
                <h2>{record.facility}</h2>
              </div>

              <span
                className={`status-badge ${record.status.toLowerCase()}`}
              >
                {record.status}
              </span>
            </div>

            <div className="facility-information">
              <div>
                <span>Latest production</span>
                <strong>{record.production.toLocaleString()} MWh</strong>
              </div>

              <div>
                <span>Operating hours</span>
                <strong>{record.operatingHours} h</strong>
              </div>

              <div>
                <span>Downtime</span>
                <strong>{record.downtimeHours} h</strong>
              </div>

              <div>
                <span>Last reported</span>
                <strong>{record.date}</strong>
              </div>
            </div>

            <Link
              to={`/records/${record.id}`}
              className="facility-details-link"
            >
              View facility record →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Facilities;