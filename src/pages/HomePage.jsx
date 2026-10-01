import "../css/HomePage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { login, logout } from "../service/token-service";
import { getMySurvivor } from "../service/survivor-service.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function HomePage() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  const [survivor, setSurvivor] = useState(null);
  const [loadingSurvivor, setLoadingSurvivor] = useState(true);

  // TODO: replace with survivor from Redux when the slice is done
  useEffect(() => {
    // HomePage is also shown when logged out, and there is no token to fetch with then
    if (!user.authenticated) return;

    async function loadSurvivor() {
      try {
        setSurvivor(await getMySurvivor());
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSurvivor(false);
      }
    }
    loadSurvivor();
  }, [user.authenticated]);

  const menuItems = [
    {
      id: "new",
      label: "New Game",
      sub: "Choose your survivor and begin",
      disabled: false,
      onClick: () => navigate(survivor ? "/delete-survivor" : "/create-survivor"),
    },
    {
      id: "continue",
      label: "Continue Game",
      sub: survivor ? survivor.name : "Continue where you left off",
      disabled: !survivor,
      onClick: () => navigate("/camp"),
    },
    {
      id: "settings",
      label: "Settings",
      sub: "Manage your survivor game",
      disabled: false,
      onClick: () => navigate("/settings"),
    },
  ];

  return (
    <div className="homepage-maincontent">
      <div className="text-center mb-16">
        <p className="blinking-title animate-pulse-red">
          ZOMBIE APOCALYPSE INCOMING
        </p>
        <h1 className="homepage-title animate-flicker">SURVIVOR</h1>
      </div>

      <nav className="flex flex-col gap-1 w-full max-w-xs">
        {user.authenticated ? (
          <>
            {loadingSurvivor ? (
              <LoadingSpinner />
            ) : (
              menuItems.map((item) => (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={item.onClick}
                  className={`group menu-button
                    ${
                      item.disabled ? "menu-button-disabled" : "menu-button-active"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`button-label
                        ${item.disabled ? "button-label-disabled" : "button-label-active"}`}
                      >
                        {item.label}
                      </p>
                      {item.sub && <p className="button-subtext">{item.sub}</p>}
                    </div>
                    {!item.disabled && <span className="button-arrow">→</span>}
                  </div>
                  {!item.disabled && <div className="button-indicator" />}
                </button>
              ))
            )}

            <button
              className="mt-20 group menu-button menu-button-active w-full font-russo"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="group menu-button menu-button-active w-full font-russo"
            onClick={login}
          >
            Login
          </button>
        )}
      </nav>
    </div>
  );
}
