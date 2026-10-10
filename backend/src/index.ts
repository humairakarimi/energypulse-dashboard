import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import database from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
  }),
);

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    status: "success",
    message: "EnergyPulse API is running",
  });
});

app.get("/api/database-health", async (_request, response) => {
  try {
    const result = await database.query(
      "SELECT current_database() AS database_name, NOW() AS connected_at",
    );

    response.json({
      status: "success",
      message: "EnergyPulse database is connected",
      database: result.rows[0].database_name,
      connectedAt: result.rows[0].connected_at,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    response.status(500).json({
      status: "error",
      message: "Could not connect to the EnergyPulse database",
    });
  }
});

app.get("/api/records", async (_request, response) => {
  try {
    const result = await database.query(`
      SELECT
        operational_records.id,
        facilities.name AS facility,
        operational_records.record_date AS date,
        operational_records.production_mwh AS production,
        operational_records.operating_hours AS "operatingHours",
        operational_records.downtime_hours AS "downtimeHours",
        operational_records.pressure_psi AS pressure,
        operational_records.temperature_c AS temperature,
        operational_records.status
      FROM operational_records
      JOIN facilities
        ON facilities.id = operational_records.facility_id
      ORDER BY
        operational_records.record_date DESC,
        operational_records.id ASC
    `);

    const records = result.rows.map((record) => ({
      id: record.id,
      facility: record.facility,
      date: record.date.toISOString().split("T")[0],
      production: Number(record.production),
      operatingHours: Number(record.operatingHours),
      downtimeHours: Number(record.downtimeHours),
      pressure: Number(record.pressure),
      temperature: Number(record.temperature),
      status: record.status,
    }));

    response.json(records);
  } catch (error) {
    console.error("Failed to retrieve operational records:", error);

    response.status(500).json({
      status: "error",
      message: "Could not retrieve operational records",
    });
  }
});

app.get("/api/records/:id", async (request, response) => {
  try {
    const recordId = Number(request.params.id);

    if (!Number.isInteger(recordId) || recordId <= 0) {
      response.status(400).json({
        status: "error",
        message: "Invalid record ID",
      });
      return;
    }

    const result = await database.query(
      `
        SELECT
          operational_records.id,
          facilities.name AS facility,
          operational_records.record_date AS date,
          operational_records.production_mwh AS production,
          operational_records.operating_hours AS "operatingHours",
          operational_records.downtime_hours AS "downtimeHours",
          operational_records.pressure_psi AS pressure,
          operational_records.temperature_c AS temperature,
          operational_records.status
        FROM operational_records
        JOIN facilities
          ON facilities.id = operational_records.facility_id
        WHERE operational_records.id = $1
      `,
      [recordId],
    );

    if (result.rows.length === 0) {
      response.status(404).json({
        status: "error",
        message: "Operational record not found",
      });
      return;
    }

    const record = result.rows[0];

    response.json({
      id: record.id,
      facility: record.facility,
      date: record.date.toISOString().split("T")[0],
      production: Number(record.production),
      operatingHours: Number(record.operatingHours),
      downtimeHours: Number(record.downtimeHours),
      pressure: Number(record.pressure),
      temperature: Number(record.temperature),
      status: record.status,
    });
  } catch (error) {
    console.error("Failed to retrieve operational record:", error);

    response.status(500).json({
      status: "error",
      message: "Could not retrieve the operational record",
    });
  }
});
app.get("/api/facilities", async (_request, response) => {
  try {
    const result = await database.query(`
      SELECT
        facilities.id,
        facilities.name,
        facilities.location,
        facilities.facility_type AS "facilityType",
        COUNT(all_records.id)::INTEGER AS "recordCount",
        latest_record.id AS "latestRecordId",
        latest_record.record_date AS "latestRecordDate",
        latest_record.production_mwh AS production,
        latest_record.operating_hours AS "operatingHours",
        latest_record.downtime_hours AS "downtimeHours",
        latest_record.status
      FROM facilities
      LEFT JOIN operational_records AS all_records
        ON all_records.facility_id = facilities.id
      LEFT JOIN LATERAL (
        SELECT
          operational_records.id,
          operational_records.record_date,
          operational_records.production_mwh,
          operational_records.operating_hours,
          operational_records.downtime_hours,
          operational_records.status
        FROM operational_records
        WHERE operational_records.facility_id = facilities.id
        ORDER BY operational_records.record_date DESC,
                 operational_records.id DESC
        LIMIT 1
      ) AS latest_record ON TRUE
      GROUP BY
        facilities.id,
        latest_record.id,
        latest_record.record_date,
        latest_record.production_mwh,
        latest_record.operating_hours,
        latest_record.downtime_hours,
        latest_record.status
      ORDER BY facilities.name ASC
    `);

    const facilities = result.rows.map((facility) => ({
      id: facility.id,
      name: facility.name,
      location: facility.location,
      facilityType: facility.facilityType,
      recordCount: facility.recordCount,
      latestRecordId: facility.latestRecordId,
      latestRecordDate: facility.latestRecordDate
        ? facility.latestRecordDate.toISOString().split("T")[0]
        : null,
      production:
        facility.production === null ? null : Number(facility.production),
      operatingHours:
        facility.operatingHours === null
          ? null
          : Number(facility.operatingHours),
      downtimeHours:
        facility.downtimeHours === null
          ? null
          : Number(facility.downtimeHours),
      status: facility.status,
    }));

    response.json(facilities);
  } catch (error) {
    console.error("Failed to retrieve facilities:", error);

    response.status(500).json({
      status: "error",
      message: "Could not retrieve facilities",
    });
  }
});


app.listen(PORT, () => {
  console.log(`EnergyPulse server is running on http://localhost:${PORT}`);
});