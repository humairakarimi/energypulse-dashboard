import RecordsTable from "../components/records/RecordsTable";

function DataRecords() {
  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1>Data Records</h1>
          <p>View, search, and filter operational records.</p>
        </div>
      </div>

      <section className="page-card">
          <RecordsTable />
      </section>
    </main>
  );
}

export default DataRecords;