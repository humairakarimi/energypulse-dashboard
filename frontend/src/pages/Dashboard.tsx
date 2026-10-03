function Dashboard() {
  return (
    <main className="main-content">
      <header className="dashboard-header">
        <div>
          <h1>Operations Dashboard</h1>
          <p>Monitor production, facilities, and operational alerts.</p>
        </div>

        <select className="date-filter">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </header>
    </main>
  );
}

export default Dashboard;