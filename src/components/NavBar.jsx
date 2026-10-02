import { Link, useNavigate } from "react-router";
import { useState } from "react";
import "../css/NavBar.css";
import "../css/SettingsPage.css";
import keycloak from "../../keycloak";
import { useDispatch, useSelector } from "react-redux";
import { clearSurvivor } from "../redux/slices/survivor/survivorSlice";

// Stroke icons based on Lucide (lucide.dev, ISC license).
const ICONS = {
    profile: (
        <>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </>
    ),
    camp: (
        <>
            <path d="M3.5 21 14 3" />
            <path d="M20.5 21 10 3" />
            <path d="M15.5 21 12 15l-3.5 6" />
            <path d="M2 21h20" />
        </>
    ),
    scavenge: (
        <>
            <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
            <path d="M8 10h8" />
            <path d="M8 18h8" />
            <path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </>
    ),
    actions: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    admin: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    logout: (
        <>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
};

function NavIcon({ name, className = "" }) {
    return (
        <svg
            className={`navbar-icon ${className}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {ICONS[name]}
        </svg>
    );
}

export default function NavBar({onLogout = () => {}}){
    const navigate = useNavigate()
    const isAdmin = keycloak.hasRealmRole("ADMIN")
    const [confirmLogout, setConfirmLogout] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const dispatch = useDispatch()

    // Navigating also closes the dropdown on small screens
    const goTo = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

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
                {/*
                  * Three layouts:
                  *  - small: Welcome + toggle, with the rest in a dropdown column
                  *  - md: two rows. From here the wrapper divs use "contents"
                  *  - 2xl: one row
                  */}
                <div className="flex items-center justify-between md:contents">
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="navbar-text link-underline font-bold"
                    >
                        Welcome, {survivor?.name ?? "survivor"}
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="navbar-toggle md:hidden"
                        aria-expanded={menuOpen}
                        aria-controls="navbar-menu"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        <NavIcon name="chevron" className={menuOpen ? "rotate-180" : ""} />
                    </button>
                </div>

                <div id="navbar-menu" className={`navbar-menu ${menuOpen ? "navbar-menu-open" : ""}`}>
                    <div className="min-h-0 overflow-hidden md:contents">
                        <div className="flex flex-col gap-2 pt-4 md:contents">
                            {/* Menu buttons */}
                            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-5 md:order-3 md:basis-full 2xl:order-0 2xl:basis-auto">
                                <button
                                    onClick={() => goTo("/profile")}
                                    className="navbar-button"
                                >
                                    <NavIcon name="profile" />
                                    My Profile
                                </button>
                                <button
                                    onClick={() => goTo("/camp")}
                                    className="navbar-button"
                                >
                                    <NavIcon name="camp" />
                                    Camp
                                </button>
                                <button
                                    onClick={() => goTo("/scavenge")}
                                    className="navbar-button"
                                >
                                    <NavIcon name="scavenge" />
                                    Scavenge
                                </button>
                                <button
                                    onClick={() => goTo("/actions")}
                                    className="navbar-button"
                                >
                                    <NavIcon name="actions" />
                                    Actions
                                </button>
                                {isAdmin && (
                                    <button
                                        onClick={() => goTo("/admin")}
                                        className="navbar-button"
                                    >
                                        <NavIcon name="admin" />
                                        Admin
                                    </button>
                                )}
                            </div>

                            {/* Account & Logout: next to Welcome on the top row on md, at the end of the row on the one-row layout */}
                            <div className="relative flex flex-col gap-2 mt-2 md:flex-row md:items-center md:gap-0 md:mt-0 md:ml-auto md:order-2 2xl:order-0">
                                {/* Long usernames get an ellipsis so they can't push the row wider */}
                                <span className="navbar-text max-w-40 truncate" title={displayName}>{displayName}</span>
                                <button
                                    onClick={() => setConfirmLogout(true)}
                                    className="navbar-button"
                                >
                                    <NavIcon name="logout" />
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
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
