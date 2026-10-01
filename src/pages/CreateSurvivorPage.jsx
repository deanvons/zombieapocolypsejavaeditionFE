import SurvivorTypeCard from "../components/SurvivorTypeCard";
import { survivorTypes } from "../components/SurvivorType.js";
import "../css/CreateSurvivorPage.css";
import { useNavigate } from "react-router";

export default function CreateSurvivorPage() {
  
const navigate = useNavigate()

  return (
    
    <div className="selectpage-maincontent mx-auto w-full max-w-6xl px-4 py-4">
      <header>
        <button
            onClick={() => navigate('/')}
            className="navbar-button m-10"
          >
            ← Back
          </button>

        <h2 className="mb-3 text-center font-russo text-3xl leading-tight tracking-wider md:text-4xl animate-flicker">
          WHO DO YOU WANT TO BE?
        </h2>
      </header>

      <div className="survivortype-components mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
        {survivorTypes.map((survivor) => (
          <SurvivorTypeCard key={survivor.name} survivor={survivor} />
        ))}
      </div>
    </div>
    
  );
}
