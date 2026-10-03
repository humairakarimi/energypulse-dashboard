import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const productionData = [
  { date: "Sep 1", production: 1850 },
  { date: "Sep 5", production: 2100 },
  { date: "Sep 10", production: 1980 },
  { date: "Sep 15", production: 2450 },
  { date: "Sep 20", production: 2310 },
  { date: "Sep 25", production: 2700 },
  { date: "Sep 30", production: 2580 },
];

function ProductionChart() {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <h2>Production Trend</h2>
          <p>Daily energy production across all facilities</p>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={productionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="production"
              stroke="#167d8d"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ProductionChart;