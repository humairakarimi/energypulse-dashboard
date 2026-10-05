import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const downtimeData = [
  { facility: "North Plant", downtime: 8 },
  { facility: "East Plant", downtime: 6 },
  { facility: "West Plant", downtime: 5 },
  { facility: "Central Plant", downtime: 4 },
  { facility: "South Plant", downtime: 3 },
];

function DowntimeChart() {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <h2>Downtime by Facility</h2>
        <p>Total downtime recorded during the selected period</p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={downtimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="facility" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="downtime"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default DowntimeChart;