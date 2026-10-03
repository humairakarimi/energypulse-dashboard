import MetricCard from "../components/dashboard/MetricCard.tsx";
import ProductionChart from "../components/dashboard/ProductionChart";

function Dashboard() {
  return (
    <main className="main-content">
      <header className="dashboard-header">
        <div>
          <h1>Operations Dashboard</h1>
          <p>Monitor production, facilities, and operational alerts.</p>
        </div>

        <select className="date-filter">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
        </select>

      </header>
      <section className="metrics-grid">
        <MetricCard
          title="Total Production"
          value="128,450 MWh"
          change="↑ 12% from previous period"
          status="positive"
        />

        <MetricCard
          title="Operating Hours"
          value="672 h"
          change="↑ 4% from previous period"
          status="positive"
        />

        <MetricCard
          title="Downtime"
          value="26 h"
          change="↓ 18% from previous period"
          status="positive"
        />

        <MetricCard
          title="Active Facilities"
          value="5 / 5"
          change="All facilities reporting"
          status="neutral"
        />

        <MetricCard
          title="Warnings"
          value="7"
          change="2 require attention"
          status="negative"
        />

        <MetricCard
          title="Critical Alerts"
          value="2"
          change="Immediate action required"
          status="negative"
        />
      </section>
      <ProductionChart />
    </main>
  );
}

export default Dashboard;