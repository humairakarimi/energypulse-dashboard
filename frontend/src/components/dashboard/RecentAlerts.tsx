type AlertStatus = "Open" | "Acknowledged" | "Resolved";
type AlertSeverity = "Critical" | "Warning" | "Info";

type Alert = {
  id: number;
  date: string;
  facility: string;
  severity: AlertSeverity;
  message: string;
  status: AlertStatus;
};

const recentAlerts: Alert[] = [
  {
    id: 1,
    date: "Sep 30, 2:32 PM",
    facility: "East Plant",
    severity: "Critical",
    message: "Turbine offline due to high vibration levels.",
    status: "Open",
  },
  {
    id: 2,
    date: "Sep 30, 11:18 AM",
    facility: "North Plant",
    severity: "Warning",
    message: "Generator output below expected range.",
    status: "Open",
  },
  {
    id: 3,
    date: "Sep 29, 4:05 PM",
    facility: "Central Plant",
    severity: "Warning",
    message: "Inlet temperature higher than normal.",
    status: "Acknowledged",
  },
  {
    id: 4,
    date: "Sep 29, 9:27 AM",
    facility: "West Plant",
    severity: "Info",
    message: "Scheduled maintenance completed.",
    status: "Resolved",
  },
  {
    id: 5,
    date: "Sep 28, 8:14 PM",
    facility: "South Plant",
    severity: "Warning",
    message: "Pressure level approaching threshold.",
    status: "Open",
  },
];

function RecentAlerts() {
  return (
    <section className="alerts-card">
      <div className="alerts-heading">
        <div>
          <h2>Recent Alerts</h2>
          <p>Latest operational events requiring review</p>
        </div>

        <button type="button" className="view-all-button">
          View All
        </button>
      </div>

      <div className="table-wrapper">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Date and Time</th>
              <th>Facility</th>
              <th>Severity</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentAlerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.date}</td>
                <td>{alert.facility}</td>

                <td>
                  <span
                    className={`severity-badge ${alert.severity.toLowerCase()}`}
                  >
                    {alert.severity}
                  </span>
                </td>

                <td>{alert.message}</td>

                <td>
                  <span
                    className={`status-badge ${alert.status.toLowerCase()}`}
                  >
                    {alert.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentAlerts;