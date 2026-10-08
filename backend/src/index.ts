import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Allow the React frontend to communicate with this backend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Allow the backend to read JSON request bodies
app.use(express.json());

// Temporary route used to confirm that the API works
app.get("/api/health", (_request, response) => {
  response.json({
    status: "success",
    message: "EnergyPulse API is running",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`EnergyPulse server is running on http://localhost:${PORT}`);
});