import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type OperationalStatus = "Normal" | "Warning" | "Critical";

type Facility = {
  id: number;
  name: string;
  location: string | null;
  facilityType: string | null;
  recordCount: number;
  latestRecordId: number | null;
  latestRecordDate: string | null;
  production: number | null;
  operatingHours: number | null;
  downtimeHours: number | null;
  status: OperationalStatus | null;
};

function Facilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadFacilities() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch(
          "http://localhost:5002/api/facilities",
        );

        if (!response.ok) {
          throw new Error("The facilities request failed.");
        }

        const data: Facility[] = await response.json();
        setFacilities(data);
      } catch (error) {
        console.error("Failed to load facilities:", error);
        setLoadError("Could not load facilities.");
      } finally {
        setIsLoading(false);
      }
    }

    loadFacilities();
  }, []);

  if (isLoading) {
    return (
      <main className="page-content">
        <p className="records-message">Loading facilities...</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="page-content">
        <p className="records-message records-error" role="alert">
          {loadError}
        </p>
      </main>
    );
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <p className="page-eyebrow">Operations</p>

        <h1>Facilities</h1>

        <p>
          Review the latest production and operational status for each
          facility.
        </p>
      </div>

      <section className="facilities-grid">
        {facilities.map((facility) => (
          <article className="facility-card" key={facility.id}>
            <div className="facility-card-header">
              <div>
                <p className="facility-label">
                  {facility.facilityType || "Facility"}
                </p>

                <h2>{facility.name}</h2>

                {facility.location && (
                  <p className="facility-location">
                    {facility.location}
                  </p>
                )}
              </div>

              {facility.status && (
                <span
                  className={`status-badge ${facility.status.toLowerCase()}`}
                >
                  {facility.status}
                </span>
              )}
            </div>

            <div className="facility-information">
              <div>
                <span>Latest production</span>
                <strong>
                  {facility.production !== null
                    ? `${facility.production.toLocaleString()} MWh`
                    : "No data"}
                </strong>
              </div>

              <div>
                <span>Operating hours</span>
                <strong>
                  {facility.operatingHours !== null
                    ? `${facility.operatingHours} h`
                    : "No data"}
                </strong>
              </div>

              <div>
                <span>Downtime</span>
                <strong>
                  {facility.downtimeHours !== null
                    ? `${facility.downtimeHours} h`
                    : "No data"}
                </strong>
              </div>

              <div>
                <span>Last reported</span>
                <strong>
                  {facility.latestRecordDate || "No records"}
                </strong>
              </div>
            </div>

            {facility.latestRecordId !== null ? (
              <Link
                to={`/records/${facility.latestRecordId}`}
                className="facility-details-link"
              >
                View latest facility record →
              </Link>
            ) : (
              <span className="facility-details-link">
                No operational records
              </span>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default Facilities;