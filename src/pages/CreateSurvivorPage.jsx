import { useState } from "react";
import { useNavigate } from "react-router";
import SurvivorTypeCard from "../components/SurvivorTypeCard";
import { survivorTypes } from "../components/SurvivorType.js";
import "../css/CreateSurvivorPage.css";

export default function CreateSurvivorPage() {
  const [survivorName, setSurvivorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInput = () => {
    if (!survivorName.trim()) {
      setErrorMessage("You must enter a name");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  return (
    <div className="create-survivor-maincontent">
      <header>
        <button
          onClick={() => navigate("/")}
          className="navbar-button create-survivor-back-button"
        >
          ← Back
        </button>
      </header>

      <h2 className="create-title animate-flicker">
        WHO DO YOU WANT TO BE?
      </h2>

      <div className="flex flex-col items-center px-8 pb-8">
        <div className="w-full max-w-sm">
          <label className="name-label" htmlFor="survivor-name">
            Survivor name
          </label>
          <input
            id="survivor-name"
            type="text"
            value={survivorName}
            onChange={(event) => {
              setSurvivorName(event.target.value);
              if (event.target.value.trim()) setErrorMessage("");
            }}
            maxLength={24}
            placeholder="Enter name"
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? "survivor-name-error" : undefined}
            className={`input-field ${
              errorMessage
                ? "border-red-500 focus:border-red-500"
                : "border-border focus:border-primary/60 focus:bg-primary/5"
            }`}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="input-alert-box">
          <p id="survivor-name-error" className="save-card-warning mb-3" role="alert">
            {errorMessage}
          </p>
        </div>
      )}

      <div className="create-survivor-type-grid">
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
          {survivorTypes.map((survivor) => (
            <SurvivorTypeCard
              key={survivor.id}
              survivor={survivor}
              customName={survivorName}
              onValidate={handleInput}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
