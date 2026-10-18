import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

type ImportResponse = {
  status: string;
  message: string;
  imported?: number;
  skipped?: number;
};

function UploadData() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setSelectedFile(null);
    setErrorMessage("");
    setSuccessMessage("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Please select a CSV file.");
      event.target.value = "";
      return;
    }

    if (file.size === 0 || file.size > 1024 * 1024) {
      setErrorMessage("Choose a non-empty CSV file no larger than 1 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile || isUploading) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsUploading(true);

    try {
      const csvContent = await selectedFile.text();

      const response = await fetch(
        `${API_URL.replace(/\/+$/, "")}/api/records/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/csv",
          },
          body: csvContent,
        },
      );

      if (response.status === 413) {
        throw new Error("The CSV file exceeds the server's size limit.");
      }

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "The server did not return an upload result. Check that the backend includes the import endpoint.",
        );
      }

      const result: ImportResponse = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Could not import this CSV.");
      }

      setSuccessMessage(result.message);
    } catch (error) {
      console.error("CSV upload failed:", error);

      setErrorMessage(
        error instanceof TypeError
          ? "Could not reach the server. The upload result is unknown. You can retry; existing facility/date pairs will be skipped."
          : error instanceof Error
            ? error.message
            : "Could not upload the CSV file.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function handleDownloadTemplate() {
    const csvContent = [
      "facility,date,production,operatingHours,downtimeHours,pressure,temperature,status",
      "North Ridge Facility,2026-10-07,4300,23,1,248,72,Normal",
    ].join("\r\n");

    const file = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "energypulse-upload-template.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }

  return (
    <main className="page-content">
      <div className="page-heading">
        <p className="page-eyebrow">Data Management</p>
        <h1>Upload Operational Data</h1>
        <p>Import facility production and operational records from CSV.</p>
      </div>

      <section className="upload-card" aria-busy={isUploading}>
        <div className="upload-icon" aria-hidden="true">
          ↑
        </div>

        <h2>Choose a CSV file</h2>

        <p className="upload-description">
          Use the template headers and existing facility names exactly.
          Upload up to 1,000 records in a file no larger than 1 MB.
          Existing facility/date pairs are skipped without changing their data.
        </p>

        <button
          type="button"
          className="report-download-button"
          onClick={handleDownloadTemplate}
        >
          Download CSV Template
        </button>

        <p className="upload-description">
          The template contains one fictional example record. Edit or remove
          it before uploading your own data. The Reports export uses a
          different format and cannot be uploaded directly.
        </p>

        <label className="file-select-button">
          Select CSV File
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="file-input"
            disabled={isUploading}
          />
        </label>

        {selectedFile && (
          <div className="selected-file">
            <span>Selected file</span>
            <strong>{selectedFile.name}</strong>
            <small>{(selectedFile.size / 1024).toFixed(1)} KB</small>
          </div>
        )}

        {errorMessage && (
          <p className="upload-error" role="alert">
            {errorMessage}
          </p>
        )}

        {isUploading && (
          <p role="status">Uploading and validating records...</p>
        )}

        {successMessage && (
          <div>
            <p className="upload-success" role="status">
              {successMessage}
            </p>

            <Link to="/records" className="facility-details-link">
              View Data Records →
            </Link>
          </div>
        )}

        <button
          type="button"
          className="upload-button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "Importing..." : "Upload Data"}
        </button>
      </section>
    </main>
  );
}

export default UploadData;