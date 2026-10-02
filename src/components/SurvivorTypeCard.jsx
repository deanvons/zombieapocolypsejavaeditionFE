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
  <div className="h-full min-w-0 flex flex-col">
    <div className={
      `card-button 
      ${hovered ? 'card-hover' : 'bg-panel'}`}
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
    
    <div className="mt-auto pt-4">
      <h4 className="small-title">Skills</h4>
      <div  className="flex flex-wrap gap-1.5">
        {survivor.skills.map((skill) => (
          <span 
          key={skill}
          className="skill-box">{skill}</span>
        ))}
      </div>
      </div>
       
      
       <button
              type="button"
              className="group menu-button-active select-survivor-button"
              onClick={handleSelect}
            >
                Select
            </button>
    </div>
  </div>
  );
  
}