import { Link, useParams } from "react-router-dom";
import { operationalRecords } from "../data/operationalRecords";

function RecordDetails() {
  const { recordId } = useParams();

  const record = operationalRecords.find(
    (currentRecord) => currentRecord.id === Number(recordId),
  );

  if (!record) {
    return (
      <main className="page-content">
        <div className="record-not-found">
          <h1>Record not found</h1>
          <p>The requested operational record does not exist.</p>

          <Link to="/records" className="back-link">
            ← Back to Data Records
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-content">
      <Link to="/records" className="back-link">
        ← Back to Data Records
      </Link>

      <div className="record-details-header">
        <div>
          <h1>{record.facility}</h1>
          <p>Operational record from {record.date}</p>
        </div>

        <span
          className={`status-badge ${record.status.toLowerCase()}`}
        >
          {record.status}
        </span>
      </div>

      <section className="record-details-card">
        <div className="record-detail-item">
          <span className="record-detail-label">Record ID</span>
          <strong>{record.id}</strong>
        </div>

        <div className="record-detail-item">
          <span className="record-detail-label">Date</span>
          <strong>{record.date}</strong>
        </div>

        <div className="record-detail-item">
          <span className="record-detail-label">Production</span>
          <strong>{record.production.toLocaleString()} MWh</strong>
        </div>

        <div className="record-detail-item">
          <span className="record-detail-label">Operating Hours</span>
          <strong>{record.operatingHours} h</strong>
        </div>

        <div className="record-detail-item">
          <span className="record-detail-label">Downtime</span>
          <strong>{record.downtimeHours} h</strong>
        </div>

        <div className="record-detail-item">
          <span className="record-detail-label">Pressure</span>
          <strong>{record.pressure} PSI</strong>
        </div>

        <div className="record-detail-item">
          <span className="record-detail-label">Temperature</span>
          <strong>{record.temperature} °C</strong>
        </div>

        <div className="record-detail-item">
          <span className="record-detail-label">Operational Status</span>
          <strong>{record.status}</strong>
        </div>
      </section>
    </main>
  );
}

export default RecordDetails;