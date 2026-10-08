import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import DataRecords from "./pages/DataRecords.tsx"
import Dashboard from "./pages/Dashboard";
import RecordDetails from "./pages/RecordDetails";
import UploadData from "./pages/UploadData";


function App() {
    return (
        <div className="app-layout">
            <Sidebar/>
            <Routes>
                <Route
                    path = "/"
                    element={<Navigate to="dashboard" replace /> }
                    />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/records" element={<DataRecords />} />
                <Route path="/records/:recordId" element={<RecordDetails />} />
                <Route path="/upload" element={<UploadData />} />

            </Routes>

        </div>

    );
}

export default App;