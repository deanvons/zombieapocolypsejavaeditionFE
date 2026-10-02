import { useNavigate } from "react-router";
import "../css/HomePage.css";
import {createSurvivor} from "../service/survivor-service"
import "../css/SurvivorTypeCard.css"
import { useState } from "react";


export default function SurvivorTypeCard({ survivor, customName, onValidate}) {
 const navigate = useNavigate()
 const[hovered, setHovered] = useState(false)

  const handleSelect = async () => {
    if(onValidate && !onValidate()){
      return;
    }
    try{
      await createSurvivor(customName, survivor.type)
      navigate("/camp")
    }  catch (error){
      console.error("Could not create survivor: ", error.message)
    }  
  }
  

  return (
  <div className="h-full flex flex-col">
    <div className={
      `text-left relative border rounded-sm overflow-hidden transition-all duration-200 cursor-pointer w-full p-2 
      ${hovered ? 'border-border-bright bg-panel-hover -translate-y-0.5' : 'border-border bg-panel'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleSelect}>

    <div className="flex items-center justify-between p-5 border-b border-border">
      <h3 className="survivor-name">{survivor.name}</h3>
    </div>

    <div className="relative h-80 overflow-hidden bg-panel">
      <img
        className="w-full h-full object-contain"
        src={survivor.image}
        alt={`${survivor.name.toLowerCase()} survivor`}
      />
    </div>


    <div className="space-y-2 m-2">
      <h4 className="font-mono text-xs uppercase tracking-widest text-text-dim mb-2 mt-5">Attributes</h4>
      <dl className="font-mono mb-3 space-y-1.5 text-xs text-body">
        {Object.entries(survivor.attributes).map(([attribute, value]) => (
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-2" key={attribute}>
            <dt>{attribute}</dt>
            <dd className="flex items-center gap-2">
              <div
                role="meter"
                aria-label={attribute}
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={value}
                className="h-2 flex-1 overflow-hidden rounded-full bg-border"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-xs text-text">
                {value}/10
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
    
    <div className="mt-auto pt-4">
      <h4 className="font-mono text-xs uppercase tracking-widest text-text-dim mb-2 mt-5">Skills</h4>
      <div  className="flex flex-wrap gap-1.5">
        {survivor.skills.map((skill) => (
          <span 
          key={skill}
          className="font-mono text-xs px-2 py-0.5 rounded-sm border border-border-bright text-text-dim bg-surface">{skill}</span>
        ))}
      </div>
      </div>
       
      
       <button
              type="button"
              className="group menu-button menu-button-active mt-auto w-full px-4 py-2 w-full py-2 font-russo text-sm tracking-widest uppercase text-center rounded-sm border transition-all duration-150"
              onClick={handleSelect}
            >
                Select
            </button>
    </div>
  </div>
  );
  
}