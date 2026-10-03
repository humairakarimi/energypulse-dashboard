type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  status: "positive" | "negative" | "neutral";
};

function MetricCard({
  title,
  value,
  change,
  status,
}: MetricCardProps) {
  return (
    <article className="metric-card">
      <p className="metric-title">{title}</p>
      <h2>{value}</h2>
      <p className={`metric-change ${status}`}>{change}</p>
    </article>
  );
}

export default MetricCard;