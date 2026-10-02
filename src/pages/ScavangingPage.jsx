import "../css/ActionPage.css";
import "../css/ScavangingPage.css";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getAllActions } from "../service/action-service.js";
import { loadItem, performAction } from "../service/survivor-service.js";
import { updateSurvivor } from "../redux/slices/survivor/survivorSlice.js";

const SCAVENGE_DURATION_MS = 5000;

// The backend has no loot endpoint, so the possible finds live here.
// Shape matches the backend's ItemLoadRequest: tools need durability, weapons need damage
const LOOT_TABLE = [
  { type: "tool", name: "Crowbar", weight: 2.5, durability: 80 },
  { type: "tool", name: "Flashlight", weight: 0.5, durability: 40 },
  { type: "tool", name: "First Aid Kit", weight: 1.2, durability: 10 },
  { type: "tool", name: "Rope", weight: 1.5, durability: 60 },
  { type: "tool", name: "Water Bottle", weight: 1, durability: 20 },
  { type: "tool", name: "Lockpick Set", weight: 0.3, durability: 25 },
  { type: "weapon", name: "Baseball Bat", weight: 1, damage: 20 },
  { type: "weapon", name: "Machete", weight: 1.3, damage: 35 },
  { type: "weapon", name: "Fire Axe", weight: 3, damage: 45 },
  { type: "weapon", name: "Kitchen Knife", weight: 0.3, damage: 12 },
  { type: "weapon", name: "Hunting Rifle", weight: 4, damage: 70 },
  { type: "weapon", name: "Pistol", weight: 1, damage: 40 },
];

const SEARCH_MESSAGES = [
  "Checking abandoned cars...",
  "Rummaging through a pharmacy...",
  "Searching a collapsed house...",
  "Looting a gas station...",
];

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Weapons are ranked by damage, tools by durability
function strengthOf(item) {
  return item.type === "weapon" ? item.damage : item.durability;
}

// Chance of coming back empty-handed: (60 - score)%, kept between 0% and 40%.
// e.g. score 41 -> 19%, 52 -> 8%, 57 -> 3%, 60 and above -> never
function nothingFoundChance(effectiveness) {
  return Math.min(Math.max(60 - effectiveness, 0), 40) / 100;
}

// Picks an item where a higher effectiveness makes stronger items more likely, but never certain.
// Items are ranked weakest (0) to strongest; each rank step multiplies the odds by e^((score - 50) / 40).
// Score 50 gives every item the same odds, above 50 favours strong items, below 50 favours weak ones.
function pickWeighted(items, effectiveness) {
  const ranked = [...items].sort((a, b) => strengthOf(a) - strengthOf(b));
  const weights = ranked.map((_, rank) => Math.exp((rank * (effectiveness - 50)) / 40));
  let roll = Math.random() * weights.reduce((sum, w) => sum + w, 0);
  for (let i = 0; i < ranked.length; i++) {
    roll -= weights[i];
    if (roll < 0) return ranked[i];
  }
  return ranked[ranked.length - 1];
}

// "tool" -> "Tool"
function formatKind(type = "") {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export default function ScavangingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const survivor = useSelector((state) => state.survivor.survivor);
  const survivorId = survivor?.id ?? null;

  // idle -> searching -> found -> kept | discarded
  const [phase, setPhase] = useState("idle");
  const [foundItem, setFoundItem] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [scavengeActionId, setScavengeActionId] = useState(null);
  const [effectiveness, setEffectiveness] = useState(null);

  const timeoutRef = useRef(null);

  // Stop the search timer if the user leaves the page mid-search
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // Find the backend's "Scavenge" action; its effectiveness decides the loot
  useEffect(() => {
    async function loadScavengeAction() {
      try {
        const actions = await getAllActions();
        const scavenge = actions.find((a) => a.name === "Scavenge");
        if (!scavenge) {
          setErrorMessage("The Scavenge action is missing.");
          return;
        }
        setScavengeActionId(scavenge.id);
      } catch (e) {
        console.error(e);
        setErrorMessage(e.message);
      }
    }

    loadScavengeAction();
  }, []);

  // type is "weapon" or "tool"; only items of that type can be found
  async function handleScavenge(type) {
    setErrorMessage(null);
    setFoundItem(null);
    setEffectiveness(null);
    setSearchMessage(randomFrom(SEARCH_MESSAGES));
    setPhase("searching");

    // The score is fetched during the wait. If the user leaves, the timer is cleared,
    // this promise never resolves, and nothing below runs on an unmounted page
    const wait = new Promise((resolve) => {
      timeoutRef.current = setTimeout(resolve, SCAVENGE_DURATION_MS);
    });

    try {
      const [result] = await Promise.all([performAction(survivorId, scavengeActionId), wait]);
      setEffectiveness(result.effectiveness);

      if (Math.random() < nothingFoundChance(result.effectiveness)) {
        setPhase("empty");
        return;
      }

      setFoundItem(pickWeighted(LOOT_TABLE.filter((item) => item.type === type), result.effectiveness));
      setPhase("found");
    } catch (e) {
      console.error(e);
      clearTimeout(timeoutRef.current);
      setErrorMessage(e.message);
      setPhase("idle");
    }
  }

  async function handleKeep() {
    if (survivorId === null) {
      setErrorMessage("No survivor found for your account.");
      return;
    }

    try {
      setErrorMessage(null);
      setSaving(true);
      const updated = await loadItem(survivorId, foundItem);
      dispatch(updateSurvivor(updated));
      setPhase("kept");
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message);
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setErrorMessage(null);
    setPhase("discarded");
  }

  return (
    <div className="m-8">
      <h1 className="action-title">Scavenge</h1>
      <h2 className="action-subtitle">Send {survivor?.name ?? "your survivor"} out to search for gear.</h2>
      {survivor === null && <p className="action-error">No survivor found for your account.</p>}

      <div className="action-card flex flex-col items-center text-center min-h-80">
        {phase === "idle" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <p className="action-card-description mb-0">
              Head out into the wasteland. It takes a moment, and you might come back with something useful.
            </p>
            {errorMessage && <p className="action-error mt-0">{errorMessage}</p>}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <ScavengeButton onClick={() => handleScavenge("weapon")} disabled={survivorId === null || scavengeActionId === null}>
                Scavenge for weapons
              </ScavengeButton>
              <ScavengeButton onClick={() => handleScavenge("tool")} disabled={survivorId === null || scavengeActionId === null}>
                Scavenge for tools
              </ScavengeButton>
            </div>
          </div>
        )}

        {phase === "searching" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 w-full max-w-md">
            <p className="font-russo text-lg text-text animate-flicker">{searchMessage}</p>
            <div
              className="scavenge-progress-track"
              role="progressbar"
              aria-label="Scavenging"
            >
              <div
                className="scavenge-progress-fill"
                style={{ animationDuration: `${SCAVENGE_DURATION_MS}ms` }}
              />
            </div>
          </div>
        )}

        {phase === "empty" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 w-full">
            {effectiveness != null && (
              <p className="action-subtitle">
                Effectiveness <span className="scavenge-effectiveness">{Math.round(effectiveness)}</span>
              </p>
            )}
            <p className="scavenge-item-name text-text-dim">You found nothing</p>
            <p className="action-card-description mb-0">The area was already picked clean.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <ScavengeButton onClick={() => setPhase("idle")}>Scavenge again</ScavengeButton>
              <ScavengeButton onClick={() => navigate("/actions")}>Back to actions</ScavengeButton>
            </div>
          </div>
        )}

        {phase === "found" && foundItem && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 w-full">
            {effectiveness != null && (
              <p className="action-subtitle">
                Effectiveness <span className="scavenge-effectiveness">{Math.round(effectiveness)}</span>
              </p>
            )}
            <p className="action-subtitle">You found:</p>
            <p className="scavenge-item-name">{foundItem.name}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="scavenge-stat">{formatKind(foundItem.type)}</span>
              <span className="scavenge-stat">{foundItem.weight} kg</span>
              {foundItem.damage != null && <span className="scavenge-stat">Damage {foundItem.damage}</span>}
              {foundItem.durability != null && <span className="scavenge-stat">Durability {foundItem.durability}</span>}
            </div>
            {errorMessage && <p className="action-error mt-0">{errorMessage}</p>}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <ScavengeButton onClick={handleKeep} disabled={saving}>
                {saving ? "Packing..." : "Keep item"}
              </ScavengeButton>
              <ScavengeButton onClick={handleDiscard} disabled={saving}>
                Discard
              </ScavengeButton>
            </div>
          </div>
        )}

        {(phase === "kept" || phase === "discarded") && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 w-full">
            <p className="font-russo text-lg text-text">
              {phase === "kept"
                ? `${foundItem.name} was added to your gear.`
                : `You left the ${foundItem.name} behind.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <ScavengeButton onClick={() => setPhase("idle")}>Scavenge again</ScavengeButton>
              <ScavengeButton onClick={() => navigate("/profile")}>View gear</ScavengeButton>
            </div>
          </div>
        )}
      </div>

      <button type="button" className="scavenge-back-link" onClick={() => navigate("/actions")}>
        &larr; Back to actions
      </button>
    </div>
  );
}

// Same look as the "Perform Action" button on the Actions page
function ScavengeButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      className="group action-entry action-entry-inactive mb-0 enabled:hover:border-primary/60 enabled:hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={disabled}
      onClick={onClick}
    >
      <p className="font-russo text-sm text-text text-center group-enabled:group-hover:text-primary">
        {children}
      </p>
    </button>
  );
}
