import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ProductionChartProps = {
  records: {
    date: string;
    production: number;
  }[];
};

function ProductionChart({ records }: ProductionChartProps) {
  const productionByDate = new Map<string, number>();

  for (const record of records) {
    productionByDate.set(
      record.date,
      (productionByDate.get(record.date) ?? 0) + record.production,
    );
  }

  const productionData = [...productionByDate.entries()]
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, production]) => ({
      date,
      production,
    }));

  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <h2>Production Trend</h2>
          <p>Daily energy production across all facilities</p>
        </div>
      </div>

      {productionData.length === 0 ? (
        <p>No production data available.</p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="linear"
                dataKey="production"
                name="Production (MWh)"
                stroke="#167d8d"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ProductionChart;