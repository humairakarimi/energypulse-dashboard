function Sidebar() {
    return (
        <aside className="sidebar">
            <div>
                <h1>EnergyPulse</h1>
                <p>Operations Analytics</p>
            </div>
            <nav className="sidebar-navigation">
                <a className="nav-link active" href="#">
                    Dashboard
                </a>
                <a className="nav-link" href="#">
                    Data Records
                </a>

                <a className="nav-link" href="#">
                    Upload Data
                </a>
                <a className="nav-link" href="#">
                    Facilities
                </a>

                <a className="nav-link" href="#">
                    Alerts
                </a>

                <a className="nav-link" href="#">
                    Reports
                </a>

            </nav>
        </aside>
    );
}

export default Sidebar;



