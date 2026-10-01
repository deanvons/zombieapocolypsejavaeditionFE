import SurvivorTypeCard from "../components/SurvivorTypeCard";
import { survivorTypes } from "../components/SurvivorType.js";
import "../css/CreateSurvivorPage.css";
import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";



export default function CreateSurvivorPage({onSelect}) {
  const [survivorName, setSurvivorname] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleInput = async () => {
    if(!survivorName.trim()){
      setErrorMessage("You must enter a name")
      return false
    }
    setErrorMessage('')
    return true
  }

  return (
    <div className="selectpage-maincontent mx-auto w-full max-w-6xl px-4 py-4">
      <header>
        <button
            onClick={() => navigate('/')}
            className="navbar-button"
          >
            ← Back
          </button>
      </header>
       <h2 className="mb-3 text-center font-russo text-3xl leading-tight tracking-wider md:text-4xl animate-flicker">
          WHO DO YOU WANT TO BE?
        </h2>
    <div className="flex flex-col items-center px-8 pb-8">
      <div className="w-full max-w-sm">
    <label className="font mono text-xs uppercase tracking-widest text-text-dim block mb-2">Survivor name</label>
      <input
      type="text"
      value={survivorName}
      onChange={(e) => {setSurvivorname(e.target.value)
        if(e.target.value.trim()) setErrorMessage("")
      }}
      maxLength={24}
      placeholder="Enter name"
      className={`w-full bg-panel border rounded-sm px-4 py-3 font-russo text-sm text-text tracking-wide
            placeholder:text-text-dim placeholder:font-sans placeholder:font-normal placeholder:tracking-normal
            focus:outline-none transition-colors duration-150 ${
              errorMessage 
                ? "border-red-500 focus:border-red-500" 
                : "border-border focus:border-primary/60 focus:bg-primary/5"
            }`}/>
      </div>
    </div>
    {errorMessage && (
      <div className="input-alert-box">
                <p className="save-card-warning mb-3">
                    You have to enter a name!
                </p>
      </div>
    )}


      <div className="survivortype-components mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
        {survivorTypes.map((survivor) => (
          <SurvivorTypeCard key={survivor.id} survivor={survivor} customName={survivorName} onValidate={handleInput} />
        ))}
      </div>
    </div>
  );
}
