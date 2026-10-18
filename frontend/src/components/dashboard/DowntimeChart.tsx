import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DowntimeChartProps = {
  records: {
    facility: string;
    downtimeHours: number;
  }[];
};

function DowntimeChart({ records }: DowntimeChartProps) {
  const downtimeByFacility = new Map<string, number>();

  for (const record of records) {
    downtimeByFacility.set(
      record.facility,
      (downtimeByFacility.get(record.facility) ?? 0) +
        record.downtimeHours,
    );
  }

  const downtimeData = [...downtimeByFacility.entries()]
    .map(([facility, downtime]) => ({
      facility,
      downtime,
    }))
    .sort((a, b) => b.downtime - a.downtime);

  return (
    <section className="chart-card">
      <div className="chart-header">
        <h2>Downtime by Facility</h2>
        <p>Total downtime across all stored records</p>
      </div>

      {downtimeData.length === 0 ? (
        <p>No downtime data available.</p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={downtimeData}
              layout="vertical"
              margin={{ left: 10, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" unit=" h" />

              <YAxis
                type="category"
                dataKey="facility"
                width={150}
                tick={{ fontSize: 12 }}
              />

              <Tooltip />

              <Bar
                dataKey="downtime"
                name="Downtime (hours)"
                fill="#2563eb"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default DowntimeChart;