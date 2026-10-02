import { useNavigate } from "react-router";
import "../css/HomePage.css";
import {createSurvivor} from "../service/survivor-service"
import "../css/SurvivorTypeCard.css"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSurvivor } from "../redux/slices/survivor/survivorSlice";


export default function SurvivorTypeCard({ survivor, customName, onValidate}) {
 const navigate = useNavigate()
 const dispatch = useDispatch()
 const[hovered, setHovered] = useState(false)

  const handleSelect = async () => {
    if(onValidate && !onValidate()){
      return;
    }
    try{
      const createdSurvivor = await createSurvivor(customName, survivor.type)
      dispatch(setSurvivor(createdSurvivor))
      navigate("/camp")
    }  catch (error){
      console.error("Could not create survivor: ", error.message)
    }  
  }
  

  return (
    <>
    <div className={
      `text-left relative border rounded-sm overflow-hidden transition-all duration-200 cursor-pointer w-full
      ${hovered ? 'border-border-bright bg-panel-hover -translate-y-0.5' : 'border-border bg-panel'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleSelect}>

    <div className="survivor-name-box">
      <h3 className="survivor-name">{survivor.name}</h3>
    </div>

    <div className="picture-box">
      <img
        className="w-full h-full object-contain"
        src={survivor.image}
        alt={`${survivor.name.toLowerCase()} survivor`}
      />
    </div>


    <div className="space-y-2 m-2">
      <h4 className="small-title">Attributes</h4>
      <dl className="font-mono mb-3 space-y-1.5 text-xs text-body">
        {Object.entries(survivor.attributes).map(([attribute, value]) => (
          <div className="attribute-title" key={attribute}>
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
              <span className="attribute-value">
                {value}/10
              </span>
            </dd>
          </div>
        ))}
      </dl>
      </div>
      <div className="flex flex-wrap gap-1.5">
      <h4 className="font-mono text-xs uppercase tracking-widest text-text-dim mb-2">Skills</h4>
      <ul className="mb-3 list-inside list-disc text-xs leading-5 text-body">
        {survivor.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      </div>

      <button
        type="button"
        className="group menu-button menu-button-active mt-auto w-full px-4 py-2"
      >
        <span className="flex items-center justify-between">
          <span className="button-label button-label-active">Select</span>
          <span className="button-arrow" aria-hidden="true">&rarr;</span>
        </span>
        <span className="button-indicator" aria-hidden="true" />
      </button>
    
    </div>
    </>
  );
  
}