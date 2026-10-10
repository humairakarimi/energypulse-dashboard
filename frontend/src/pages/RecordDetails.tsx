import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {API_URL} from "../config";

type OperationalStatus = "Normal" | "Warning" | "Critical";

type OperationalRecord = {
    id: number;
    facility: string;
    date: string;
    production: number;
    operatingHours: number;
    downtimeHours: number;
    pressure: number;
    temperature: number;
    status: OperationalStatus;
};

function RecordDetails() {
    const {recordId} = useParams();

    const [record, setRecord] = useState<OperationalRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        async function loadRecord() {
            try {
                setIsLoading(true);
                setLoadError("");

                const response = await fetch(
                    `${API_URL}/api/records/${recordId}`,
                );

                if (response.status === 404) {
                    throw new Error("Record not found.");
                }

                if (!response.ok) {
                    throw new Error("The record request failed.");
                }

                const data: OperationalRecord = await response.json();
                setRecord(data);
            } catch (error) {
                console.error("Failed to load record:", error);

                setLoadError(
                    error instanceof Error
                        ? error.message
                        : "Could not load the operational record.",
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadRecord();
    }, [recordId]);

    if (isLoading) {
        return (
            <main className="page-content">
                <p className="records-message">Loading operational record...</p>
            </main>
        );
    }

    if (loadError || !record) {
        return (
            <main className="page-content">
                <div className="record-not-found">
                    <h1>Record not found</h1>

                    <p>
                        {loadError || "The requested operational record does not exist."}
                    </p>

                    <Link to="/records" className="back-link">
                        ← Back to Data Records
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page-content">
            <Link to="/records" className="back-link">
                ← Back to Data Records
            </Link>

            <div className="record-details-header">
                <div>
                    <h1>{record.facility}</h1>
                    <p>Operational record from {record.date}</p>
                </div>

                <span className={`status-badge ${record.status.toLowerCase()}`}>
          {record.status}
        </span>
            </div>

            <section className="record-details-card">
                <div className="record-detail-item">
                    <span className="record-detail-label">Record ID</span>
                    <strong>{record.id}</strong>
                </div>

                <div className="record-detail-item">
                    <span className="record-detail-label">Date</span>
                    <strong>{record.date}</strong>
                </div>

                <div className="record-detail-item">
                    <span className="record-detail-label">Production</span>
                    <strong>{record.production.toLocaleString()} MWh</strong>
                </div>

                <div className="record-detail-item">
                    <span className="record-detail-label">Operating Hours</span>
                    <strong>{record.operatingHours} h</strong>
                </div>

                <div className="record-detail-item">
                    <span className="record-detail-label">Downtime</span>
                    <strong>{record.downtimeHours} h</strong>
                </div>

                <div className="record-detail-item">
                    <span className="record-detail-label">Pressure</span>
                    <strong>{record.pressure} PSI</strong>
                </div>

                <div className="record-detail-item">
                    <span className="record-detail-label">Temperature</span>
                    <strong>{record.temperature} °C</strong>
                </div>

                <div className="record-detail-item">
                    <span className="record-detail-label">Operational Status</span>
                    <strong>{record.status}</strong>
                </div>
            </section>
        </main>
    );
}

export default RecordDetails;