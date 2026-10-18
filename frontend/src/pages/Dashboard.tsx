import {useEffect, useState} from "react";
import {API_URL} from "../config";
import MetricCard from "../components/dashboard/MetricCard.tsx";
import ProductionChart from "../components/dashboard/ProductionChart";
import DowntimeChart from "../components/dashboard/DowntimeChart";
import OperationalStatusChart from "../components/dashboard/OperationalStatusChart";
import RecentAlerts from "../components/dashboard/RecentAlerts";

type OperationalRecord = {
    id: number;
    facility: string;
    date: string;
    production: number;
    operatingHours: number;
    downtimeHours: number;
    status: "Normal" | "Warning" | "Critical";
};

function Dashboard() {
    const [records, setRecords] = useState<OperationalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadRecords() {
            try {
                const response = await fetch(
                    `${API_URL.replace(/\/+$/, "")}/api/records`,
                    {signal: controller.signal},
                );

                if (!response.ok) {
                    throw new Error("The records request failed.");
                }

                const data: OperationalRecord[] = await response.json();
                setRecords(data);
            } catch (error) {
                if (controller.signal.aborted) return;

                console.error("Failed to load dashboard records:", error);
                setLoadError("Could not load dashboard data.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadRecords();

        return () => controller.abort();
    }, []);

    const totalProduction = records.reduce(
        (total, record) => total + record.production,
        0,
    );

    const totalOperatingHours = records.reduce(
        (total, record) => total + record.operatingHours,
        0,
    );

    const totalDowntime = records.reduce(
        (total, record) => total + record.downtimeHours,
        0,
    );

    // Use each facility's latest record to count its current status.
    const latestByFacility = new Map<string, OperationalRecord>();

    for (const record of records) {
        const existing = latestByFacility.get(record.facility);

        if (
            !existing ||
            record.date > existing.date ||
            (record.date === existing.date && record.id > existing.id)
        ) {
            latestByFacility.set(record.facility, record);
        }
    }

    const latestRecords = [...latestByFacility.values()];

    const warnings = latestRecords.filter(
        (record) => record.status === "Warning",
    ).length;

    const criticalAlerts = latestRecords.filter(
        (record) => record.status === "Critical",
    ).length;

    return (
        <main className="main-content">
            <header className="dashboard-header">
                <div>
                    <h1>Operations Dashboard</h1>
                    <p>Monitor production, facilities, and operational alerts.</p>
                </div>
            </header>

            {isLoading ? (
                <p role="status">Loading dashboard data...</p>
            ) : loadError ? (
                <p role="alert">{loadError}</p>
            ) : records.length === 0 ? (
                <p>No operational records available.</p>
            ) : (
                <section className="metrics-grid">
                    <MetricCard
                        title="Total Production"
                        value={`${totalProduction.toLocaleString()} MWh`}
                        change="Across all stored records"
                        status="neutral"
                    />

                    <MetricCard
                        title="Operating Hours"
                        value={`${totalOperatingHours.toLocaleString()} h`}
                        change="Across all stored records"
                        status="neutral"
                    />

                    <MetricCard
                        title="Downtime"
                        value={`${totalDowntime.toLocaleString()} h`}
                        change="Across all stored records"
                        status="neutral"
                    />

                    <MetricCard
                        title="Reporting Facilities"
                        value={latestRecords.length.toString()}
                        change="Facilities with stored records"
                        status="neutral"
                    />

                    <MetricCard
                        title="Warnings"
                        value={warnings.toString()}
                        change="Based on each facility's latest record"
                        status={warnings > 0 ? "negative" : "neutral"}
                    />

                    <MetricCard
                        title="Critical Alerts"
                        value={criticalAlerts.toString()}
                        change="Based on each facility's latest record"
                        status={criticalAlerts > 0 ? "negative" : "neutral"}
                    />
                </section>
            )}



            {!isLoading && !loadError && (
                <ProductionChart records={records}/>
            )}

            <section className="secondary-charts-grid">
                {!isLoading && !loadError && (
  <DowntimeChart records={records} />
)}
                {!isLoading && !loadError && (
  <OperationalStatusChart records={latestRecords} />
)}
            </section>

            {!isLoading && !loadError && (
  <RecentAlerts records={latestRecords} />
)}
        </main>
    );
}

export default Dashboard;