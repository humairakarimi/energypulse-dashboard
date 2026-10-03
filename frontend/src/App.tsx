import "./App.css";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";


function App() {
    return (
        <div className="app-layout">
            <Sidebar/>
            <Dashboard />
        </div>

    );
}

export default App;