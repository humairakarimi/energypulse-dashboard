import {useState, type ChangeEvent} from "react";

function UploadData() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        setErrorMessage("");
        setSuccessMessage("");

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (!file.name.toLowerCase().endsWith(".csv")) {
            setSelectedFile(null);
            setErrorMessage("Please select a CSV file.");
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
    }

    function handleUpload() {
        if (!selectedFile) {
            setErrorMessage("Please select a CSV file before uploading.");
            return;
        }

        setSuccessMessage(
            `${selectedFile.name} is ready for processing.`
        );
    }

    return (
        <main className="page-content">
            <div className="page-heading">
                <p className="page-eyebrow">Data Management</p>
                <h1>Upload Operational Data</h1>
                <p>
                    Upload a CSV file containing facility production and operational
                    records.
                </p>
            </div>

            <section className="upload-card">
                <div className="upload-icon" aria-hidden="true">
                    ↑
                </div>

                <h2>Choose a CSV file</h2>

                <p className="upload-description">
                    The file should contain facility, date, production, operating hours,
                    downtime, pressure, temperature, and status columns.
                </p>

                <label className="file-select-button">
                    Select CSV File
                    <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileChange}
                        className="file-input"
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
                {successMessage && (
                    <p className="upload-success" role="status">
                        {successMessage}
                    </p>
                )}

                <button
                    type="button"
                    className="upload-button"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                >
                    Upload Data
                </button>
            </section>
        </main>
    );
}

export default UploadData;