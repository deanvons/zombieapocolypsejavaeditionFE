import { useNavigate } from "react-router";
import { useState } from "react";
import "../css/NavBar.css";
import "../css/SettingsPage.css";
import keycloak from "../../keycloak";
import { useSelector } from "react-redux";

export default function NavBar({ onLogout = () => {}, savedGame }) {
    const navigate = useNavigate();
    const isAdmin = keycloak.hasRealmRole("ADMIN");
    const [confirmLogout, setConfirmLogout] = useState(false);

    const handleLogout = () => {
        onLogout();
        setConfirmLogout(false);
        keycloak.logout({
            redirectUri: window.location.origin + "/",
        });
    };

    const displayName = useSelector((state) => state.user?.displayName); //getting displayName from redux

    return (
        <header className="navbar-header">
            <nav className="navbar">
                <span className="navbar-text font-bold">
                    Welcome Survivorname
                </span>{" "}
                {/*should be {savedGame.survivorName}*/}
                <button
                    onClick={() => navigate("/profile")}
                    className="navbar-button"
                >
                    My profile
                </button>
                <button
                    onClick={() => navigate("/camp")}
                    className="navbar-button"
                >
                    Camp
                </button>
                <button
                    onClick={() => navigate("/actions")}
                    className="navbar-button"
                >
                    Actions
                </button>
                {isAdmin && (
                    <button
                        onClick={() => navigate("/admin")}
                        className="navbar-button"
                    >
                        Admin
                    </button>
                )}
                <div className="relative ml-auto">
                    <span className="navbar-text">{displayName}</span>
                    <button
                        onClick={() => setConfirmLogout(true)}
                        className="navbar-button"
                    >
                        Log out
                    </button>

                    {confirmLogout && (
                        <div className="alert-box">
                            <p className="save-card-warning mb-3">
                                Are you sure you want to log out?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLogout}
                                    className="delete-danger-button"
                                >
                                    Yes, log out
                                </button>
                                <button
                                    onClick={() => setConfirmLogout(false)}
                                    className="delete-cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
