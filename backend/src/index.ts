import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import database from "./database.js";
import { parse } from "csv-parse/sync";
import type { PoolClient } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

const allowedOrigins = process.env.FRONTEND_URL
  ? [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL,
    ]
  : [
      "http://localhost:5173",
      "http://localhost:5174",
    ];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    status: "success",
    message: "EnergyPulse API is running",
    documentation: "/api/health",
  });
});

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
type ImportRecord = {
  facility: string;
  date: string;
  production: number;
  operatingHours: number;
  downtimeHours: number;
  pressure: number;
  temperature: number;
  status: string;
};

app.post(
  "/api/records/import",
  express.text({ type: "text/csv", limit: "1mb" }),
  async (request, response) => {
    const requiredHeaders = [
      "facility",
      "date",
      "production",
      "operatingHours",
      "downtimeHours",
      "pressure",
      "temperature",
      "status",
    ];

    let records: ImportRecord[];

    // Validate the entire file before saving anything.
    try {
      if (typeof request.body !== "string" || !request.body.trim()) {
        throw new Error("Send a non-empty CSV file as text/csv.");
      }

      const rows = parse(request.body, {
        bom: true,
        skip_empty_lines: true,
        trim: true,
        max_record_size: 8192,
      }) as string[][];

      const headers = rows.shift();

      if (
        !headers ||
        headers.length !== requiredHeaders.length ||
        new Set(headers).size !== headers.length ||
        requiredHeaders.some((header) => !headers.includes(header))
      ) {
        throw new Error(
          `CSV headers must be: ${requiredHeaders.join(",")}`,
        );
      }

      const validatedHeaders = headers;

      if (rows.length === 0 || rows.length > 1000) {
        throw new Error("Upload between 1 and 1,000 data rows.");
      }

      records = rows.map((cells, index) => {
        const rowNumber = index + 2;

        function fail(message: string): never {
          throw new Error(`Row ${rowNumber}: ${message}`);
        }

        if (cells.length !== headers.length) {
          fail("The number of values does not match the headers.");
        }

        function field(name: string): string {
          const value = cells[validatedHeaders.indexOf(name)];

          if (!value) {
            fail(`${name} is required.`);
          }

          return value;
        }

        function numberField(
          name: string,
          minimum: number,
          maximum: number,
        ): number {
          const text = field(name);

          if (!/^-?\d+(?:\.\d{1,2})?$/.test(text)) {
            fail(`${name} must be a number with at most 2 decimal places.`);
          }

          const value = Number(text);

          if (!Number.isFinite(value) || value < minimum || value > maximum) {
            fail(`${name} must be between ${minimum} and ${maximum}.`);
          }

          return value;
        }

        const date = field("date");

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          fail("date must use YYYY-MM-DD.");
        }

        const parsedDate = new Date(`${date}T00:00:00.000Z`);

        if (
          Number.isNaN(parsedDate.getTime()) ||
          parsedDate.toISOString().slice(0, 10) !== date
        ) {
          fail("date must be a valid calendar date.");
        }

        const status = field("status");

        if (!["Normal", "Warning", "Critical"].includes(status)) {
          fail("status must be Normal, Warning, or Critical.");
        }

        const operatingHours = numberField("operatingHours", 0, 24);
        const downtimeHours = numberField("downtimeHours", 0, 24);

        if (Math.round((operatingHours + downtimeHours) * 100) > 2400) {
          fail("operatingHours plus downtimeHours cannot exceed 24.");
        }

        return {
          facility: field("facility"),
          date,
          production: numberField("production", 0, 9999999999.99),
          operatingHours,
          downtimeHours,
          pressure: numberField("pressure", 0, 999999.99),
          temperature: numberField("temperature", -9999.99, 9999.99),
          status,
        };
      });
    } catch (error) {
      response.status(400).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Invalid CSV file.",
      });
      return;
    }

    // A dedicated connection keeps all inserts in one transaction.
    let client: PoolClient | undefined;

    try {
      client = await database.connect();
      await client.query("BEGIN");

      const facilityResult = await client.query<{
        id: number;
        name: string;
      }>("SELECT id, name FROM facilities");

      const facilityIds = new Map(
        facilityResult.rows.map((facility) => [
          facility.name,
          facility.id,
        ]),
      );

      const unknownFacilities = [
        ...new Set(
          records
            .filter((record) => !facilityIds.has(record.facility))
            .map((record) => record.facility),
        ),
      ];

      if (unknownFacilities.length > 0) {
        await client.query("ROLLBACK");

        response.status(400).json({
          status: "error",
          message:
            `Unknown facilities: ${unknownFacilities.join(", ")}. ` +
            "Use existing facility names exactly.",
        });
        return;
      }

      let imported = 0;

      for (const record of records) {
        const result = await client.query(
          `
            INSERT INTO operational_records (
              facility_id,
              record_date,
              production_mwh,
              operating_hours,
              downtime_hours,
              pressure_psi,
              temperature_c,
              status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (facility_id, record_date) DO NOTHING
            RETURNING id
          `,
          [
            facilityIds.get(record.facility),
            record.date,
            record.production,
            record.operatingHours,
            record.downtimeHours,
            record.pressure,
            record.temperature,
            record.status,
          ],
        );

        imported += result.rowCount ?? 0;
      }

      await client.query("COMMIT");

      response.json({
        status: "success",
        imported,
        skipped: records.length - imported,
        message: `Imported ${imported} records. Skipped ${
          records.length - imported
        } duplicate facility/date pairs.`,
      });
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK").catch(() => {});
      }

      console.error("CSV import failed:", error);

      response.status(500).json({
        status: "error",
        message: "Import failed. No records from this upload were saved.",
      });
    } finally {
      client?.release();
    }
  },
);

app.listen(PORT, () => {
  console.log(`EnergyPulse server is running on http://localhost:${PORT}`);
});