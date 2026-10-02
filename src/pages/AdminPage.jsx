import { Navigate } from "react-router";
import keycloak from "../../keycloak";
import "../css/SettingsPage.css";
import { useEffect, useState } from "react";
import "../css/AdminPage.css";

export default function AdminPage(){
    const [auditEntries, setAuditEntries] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL
    // Hiding the navbar link isn't enough on its own - block direct visits to /admin too
    if (!keycloak.hasRealmRole("ADMIN")) {
        return <Navigate to="/" replace />
    }

    useEffect(() => {
        fetch(`${API_URL}/api/audit`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((audits) => setAuditEntries(audits));
    }, []);

    return (
        <div className="settings-maincontent">
            <h1 className="settings-title">Admin</h1>
            <div className="audit-entries-container">
                {auditEntries.map((entry) => (
                    <div className="audit-entry">
                        <span>{entry.actorId}, </span>
                        <span>{entry.actionType}, </span>
                        <span>{entry.entityType}, </span>
                        <span>{entry.entityId}, </span>
                        <span>{entry.details}, </span>
                        <span>{entry.timeStamp}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
