import { Navigate } from "react-router";
import keycloak from "../../keycloak";
import "../css/SettingsPage.css";

export default function AdminPage(){
    // Hiding the navbar link isn't enough on its own - block direct visits to /admin too
    if (!keycloak.hasRealmRole("ADMIN")) {
        return <Navigate to="/" replace />
    }

    return(
        <div className="settings-maincontent">
            <h1 className="settings-title">Admin</h1>
        </div>
    )
}
