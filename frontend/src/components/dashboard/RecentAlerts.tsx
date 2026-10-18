import { Link } from "react-router-dom";

type RecentAlertsProps = {
  records: {
    id: number;
    date: string;
    facility: string;
    status: "Normal" | "Warning" | "Critical";
    downtimeHours: number;
  }[];
};

function RecentAlerts({ records }: RecentAlertsProps) {
  const recentAlerts = records
    .filter((record) => record.status !== "Normal")
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.id - a.id,
    )
    .slice(0, 5);

  return (
    <section className="alerts-card">
      <div className="alerts-heading">
        <div>
          <h2>Recent Alerts</h2>
          <p>Warning and critical statuses from latest facility records</p>
        </div>

        <Link to="/alerts" className="view-all-button">
          View All
        </Link>
      </div>

      {recentAlerts.length === 0 ? (
        <p>No warning or critical statuses in the latest facility records.</p>
      ) : (
        <div className="table-wrapper">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Record Date</th>
                <th>Facility</th>
                <th>Severity</th>
                <th>Summary</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {recentAlerts.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.facility}</td>

                  <td>
                    <span
                      className={`severity-badge ${record.status.toLowerCase()}`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td>
                    {record.status} status reported with{" "}
                    {record.downtimeHours} h of downtime.
                  </td>

                  <td>
                    <Link
  to={`/records/${record.id}`}
  state={{ from: "/dashboard" }}
>
  Review record →
</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecentAlerts;