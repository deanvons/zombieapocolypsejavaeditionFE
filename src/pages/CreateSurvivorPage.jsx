import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import SurvivorTypeCard from "../components/SurvivorTypeCard";
import { survivorTypes } from "../components/SurvivorType.js";
import { createSurvivor } from "../service/survivor-service.js";
import { setSurvivor } from "../redux/slices/survivor/survivorSlice";
import "../css/CreateSurvivorPage.css";

export default function CreateSurvivorPage() {
  const [survivorName, setSurvivorName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChooseSurvivor = async (survivorType) => {
    if (!survivorName.trim()) {
      setErrorMessage("You must enter a name");
      return;
    }
    setErrorMessage("");

    try {
      const createdSurvivor = await createSurvivor(survivorName, survivorType);
      dispatch(setSurvivor(createdSurvivor));
      navigate("/camp");
    } catch (error) {
      console.error("Could not create survivor:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    
    <div className="selectpage-maincontent">
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


      <div className="survivor-type-grid">
        {survivorTypes.map((survivor) => (
          <SurvivorTypeCard key={survivor.id} survivor={survivor} onClickCard={handleChooseSurvivor} />
        ))}
      </div>
    </div>
  );
}
