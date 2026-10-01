import SurvivorTypeCard from "../components/SurvivorTypeCard";
import { survivorTypes } from "../components/SurvivorType.js";
import "../css/CreateSurvivorPage.css";
import { useNavigate } from "react-router";

export default function CreateSurvivorPage() {
  
const navigate = useNavigate()

  return (
    
    <div className="create-survivor-maincontent">
      <header>
        <button
            onClick={() => navigate('/')}
            className="navbar-button create-survivor-back-button"
          >
            ← Back
          </button>

        <h2 className="create-survivor-title animate-flicker">
          WHO DO YOU WANT TO BE?
        </h2>
      </header>

      <div className="create-survivor-type-grid">
        {survivorTypes.map((survivor) => (
          <SurvivorTypeCard key={survivor.name} survivor={survivor} />
        ))}
      </div>
    </div>
    
  );
}
