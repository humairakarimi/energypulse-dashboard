import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type OperationalStatusChartProps = {
  records: {
    status: "Normal" | "Warning" | "Critical";
  }[];
};

function OperationalStatusChart({
  records,
}: OperationalStatusChartProps) {
  const statusData = [
    {
      name: "Normal",
      value: records.filter((record) => record.status === "Normal").length,
      color: "#16a34a",
    },
    {
      name: "Warning",
      value: records.filter((record) => record.status === "Warning").length,
      color: "#f59e0b",
    },
    {
      name: "Critical",
      value: records.filter((record) => record.status === "Critical").length,
      color: "#dc2626",
    },
  ];

  return (
    <section className="chart-card">
      <div className="chart-header">
        <h2>Operational Status</h2>
        <p>Based on each facility's latest stored record</p>
      </div>

      {records.length === 0 ? (
        <p>No facility status data available.</p>
      ) : (
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
      )}
    </section>
  );
}

export default OperationalStatusChart;