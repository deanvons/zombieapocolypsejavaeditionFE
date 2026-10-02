import { useNavigate } from "react-router";
import { useState } from "react";
import "../css/NavBar.css";
import "../css/SettingsPage.css";
import keycloak from "../../keycloak";
import { useDispatch, useSelector } from "react-redux";
import { clearSurvivor } from "../redux/slices/survivor/survivorSlice";


    

export default function NavBar({onLogout = () => {}}){
    const navigate = useNavigate()
    const isAdmin = keycloak.hasRealmRole("ADMIN")
    const [confirmLogout, setConfirmLogout] = useState(false)
    const dispatch = useDispatch()

    const handleLogout = () => {
        onLogout();
        dispatch(clearSurvivor());
        setConfirmLogout(false);
        keycloak.logout({
            redirectUri: window.location.origin + "/",
        });
    };

    const displayName = useSelector((state) => state.user?.displayName); //getting displayName from redux
    const survivor = useSelector((state) => state.survivor.survivor);

    return (
        <header className="navbar-header">
            <nav className="navbar">
                <span className="navbar-text font-bold">
                    Welcome {survivor?.name ?? "survivor"}
                </span>
                <button
                    onClick={() => navigate("/")}
                    className="navbar-button"
                >
                    Home
                </button>
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
