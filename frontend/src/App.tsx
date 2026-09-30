import "./App.css";
import Sidebar from "./components/layout/Sidebar";

function App() {
    return (
        <div className="app-layout">
            <Sidebar/>
            <main className="app-intro">
                <h1>EnergyPulse</h1>
                <p>Welcome to the EnergyPulse OperationsnDashboard</p>
            </main>
        </div>

    );
}

export default App;