import {useState} from "react";
import {operationalRecords} from "../../data/operationalRecords";
import {useNavigate} from "react-router-dom";

function RecordsTable() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedDate, setSelectedDate] = useState("");

    const facilities = [
        ...new Set(operationalRecords.map((record) => record.facility)),
    ];

    const filteredRecords = operationalRecords.filter((record) => {
        const matchesSearch = record.facility
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesFacility =
            selectedFacility === "All" || record.facility === selectedFacility;

        const matchesStatus =
            selectedStatus === "All" || record.status === selectedStatus;
        const matchesDate =
            selectedDate === "" || record.date === selectedDate;


        return (
            matchesSearch &&
            matchesFacility &&
            matchesStatus &&
            matchesDate
        );
    });

    function handleExport() {
        const headers = [
            "Facility",
            "Date",
            "Production",
            "Operating Hours",
            "Downtime",
            "Pressure",
            "Temperature",
            "Status",
        ];

        const rows = filteredRecords.map((record) => [
            record.facility,
            record.date,
            record.production,
            record.operatingHours,
            record.downtimeHours,
            record.pressure,
            record.temperature,
            record.status,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const file = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const downloadUrl = URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = "energy-records.csv";
        link.click();

        URL.revokeObjectURL(downloadUrl);
    }

    return (
        <>
            <div className="records-toolbar">
                <input
                    type="search"
                    className="records-search"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />

                <select
                    className="records-filter"
                    value={selectedFacility}
                    onChange={(event) => setSelectedFacility(event.target.value)}
                >
                    <option value="All">All facilities</option>

                    {facilities.map((facility) => (
                        <option key={facility} value={facility}>
                            {facility}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    className="records-date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                />
                <button
                    type="button"
                    className="export-button"
                    onClick={handleExport}
                    disabled={filteredRecords.length === 0}
                >
                    Export CSV
                </button>

                <select
                    className="records-filter"
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                >
                    <option value="All">All statuses</option>
                    <option value="Normal">Normal</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                </select>
            </div>
            <div className="records-table-container">
                <table className="records-table">
                    <thead>
                    <tr>
                        <th>Facility</th>
                        <th>Date</th>
                        <th>Production</th>
                        <th>Operating Hours</th>
                        <th>Downtime</th>
                        <th>Pressure</th>
                        <th>Temperature</th>
                        <th>Status</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredRecords.map((record) => (
                        <tr
                            key={record.id}
                            className="clickable-record-row"
                            onClick={() => navigate(`/records/${record.id}`)}
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    navigate(`/records/${record.id}`);
                                }
                            }}
                        >
                            <td>{record.facility}</td>
                            <td>{record.date}</td>
                            <td>{record.production.toLocaleString()} MWh</td>
                            <td>{record.operatingHours} h</td>
                            <td>{record.downtimeHours} h</td>
                            <td>{record.pressure} PSI</td>
                            <td>{record.temperature} °C</td>
                            <td>
                <span
                    className={`status-badge ${record.status.toLowerCase()}`}
                >
                  {record.status}
                </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filteredRecords.length === 0 && (
                    <p className="no-records-message">
                        No operational records match your filters.
                    </p>
                )}
            </div>
        </>
    );
}

export default RecordsTable;