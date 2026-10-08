import {NavLink} from "react-router-dom"

function Sidebar() {
    return (
        <aside className="sidebar">
            <div>
                <h1>EnergyPulse</h1>
                <p>Operations Analytics</p>
            </div>
            <nav className="sidebar-navigation">
                <NavLink
                    to="/dashboard"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/records"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Data Records
                </NavLink>

                <NavLink
                    to="/upload"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Upload Data
                </NavLink>
                <NavLink
                    to="/facilities"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Facilities
                </NavLink>

                <NavLink
                    to="/alerts"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Alerts
                </NavLink>

                <NavLink
                    to="/reports"
                    className={({isActive}) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Reports
                </NavLink>

            </nav>
        </aside>
    );
}

export default Sidebar;



