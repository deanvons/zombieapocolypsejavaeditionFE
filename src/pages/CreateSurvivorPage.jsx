import SurvivorTypeCard from "../components/SurvivorTypeCard";
import { survivorTypes } from "../components/SurvivorType";
import "../css/CreateSurvivorPage.css";



export default function CreateSurvivorPage() {
  return (
    <div className="selectpage-maincontent mx-auto w-full max-w-6xl px-4 py-4">
      <header>
        <h2 className="mb-3 text-center font-russo text-3xl leading-tight tracking-wider md:text-4xl animate-flicker">
          WHO DO YOU WANT TO BE?
        </h2>
      </header>

      <div className="survivortype-components mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
        {survivorTypes.map((survivor) => (
          <SurvivorTypeCard key = {survivor.name} survivor={survivor}/>
        ))}
      </div>
    </div>
  );
}
