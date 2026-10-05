import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const statusData = [
  { name: "Normal", value: 3, color: "#16a34a" },
  { name: "Warning", value: 1, color: "#f59e0b" },
  { name: "Critical", value: 1, color: "#dc2626" },
];

function OperationalStatusChart() {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <h2>Operational Status</h2>
        <p>Current status of all facilities</p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
            >
              {statusData.map((status) => (
                <Cell key={status.name} fill={status.color} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default OperationalStatusChart;