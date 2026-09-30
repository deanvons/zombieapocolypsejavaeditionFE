import { Navigate } from "react-router";
import keycloak from "../../keycloak";
import "../css/SettingsPage.css";
import { useEffect } from "react";

export default function AdminPage(){

    const API_URL = import.meta.env.VITE_API_URL
    // Hiding the navbar link isn't enough on its own - block direct visits to /admin too
    if (!keycloak.hasRealmRole("ADMIN")) {
        return <Navigate to="/" replace />
    }

    useEffect(   
      ()=>fetch(`${API_URL}/api/profiles/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          "Content-Type": "application/json",
        },
      }).then(response => console.log(response)),[])

    return(
        <div className="settings-maincontent">
            <h1 className="settings-title">Admin</h1>
        </div>
    )
}
