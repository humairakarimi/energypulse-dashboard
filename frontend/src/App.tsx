import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import DataRecords from "./pages/DataRecords.tsx"
import Dashboard from "./pages/Dashboard";


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

            </Routes>

        </div>

    );
}

export default App;