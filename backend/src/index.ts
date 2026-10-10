import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import database from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(
  cors({
    origin: "http://localhost:5173",
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

app.listen(PORT, () => {
  console.log(`EnergyPulse server is running on http://localhost:${PORT}`);
});