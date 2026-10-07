type OperationalStatus = "Normal" | "Warning" | "Critical";

type OperationalRecord = {
  id: number;
  facility: string;
  date: string;
  production: number;
  operatingHours: number;
  downtimeHours: number;
  pressure: number;
  temperature: number;
  status: OperationalStatus;
};

const records: OperationalRecord[] = [
  {
    id: 1,
    facility: "North Ridge Facility",
    date: "2026-10-06",
    production: 4280,
    operatingHours: 23.5,
    downtimeHours: 0.5,
    pressure: 248,
    temperature: 72,
    status: "Normal",
  },
  {
    id: 2,
    facility: "Clearwater Station",
    date: "2026-10-06",
    production: 3750,
    operatingHours: 21,
    downtimeHours: 3,
    pressure: 231,
    temperature: 78,
    status: "Warning",
  },
  {
    id: 3,
    facility: "Prairie View Plant",
    date: "2026-10-06",
    production: 2910,
    operatingHours: 18.5,
    downtimeHours: 5.5,
    pressure: 205,
    temperature: 89,
    status: "Critical",
  },
  {
    id: 4,
    facility: "Summit Processing",
    date: "2026-10-05",
    production: 4015,
    operatingHours: 24,
    downtimeHours: 0,
    pressure: 242,
    temperature: 70,
    status: "Normal",
  },
  {
    id: 5,
    facility: "West Valley Site",
    date: "2026-10-05",
    production: 3560,
    operatingHours: 22,
    downtimeHours: 2,
    pressure: 225,
    temperature: 76,
    status: "Warning",
  },
];

function RecordsTable() {
  return (
    <div className="records-table-container">
      <table className="records-table">
        <thead>
          <tr>
            <th>Facility</th>
            <th>Date</th>
            <th>Production</th>
            <th>Operating Hours</th>
            <th>Downtime</th>
            <th>Pressure</th>
            <th>Temperature</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.facility}</td>
              <td>{record.date}</td>
              <td>{record.production.toLocaleString()} MWh</td>
              <td>{record.operatingHours} h</td>
              <td>{record.downtimeHours} h</td>
              <td>{record.pressure} PSI</td>
              <td>{record.temperature} °C</td>
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
  );
}

export default RecordsTable;