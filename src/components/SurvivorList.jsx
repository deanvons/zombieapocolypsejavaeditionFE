
import { useEffect, useState } from "react";
import keycloak from "../../keycloak";
import { survivorTypes } from "./SurvivorType.js";
import "../css/HomePage.css";
import { getAllSurvivors } from "../service/survivor-service.js";

const API_URL = import.meta.env.VITE_API_URL

function formatEnum(value) {
  return String(value)
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


export default function SurvivorList(){
    const [survivors, setSurvivors] = useState([]);


    useEffect(() =>{
        async function loadSurvivors(){
            try{
                setSurvivors(await getAllSurvivors())
            } catch (e){
                console.error(e);
            }
        }
        loadSurvivors();
    })
    if (survivors.length === 0) return <p className="text-center text-body">No survivors yet.</p>;

    return (
     <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
          {survivors.map((survivor) => {
            // SurvivorResponse has no attributes, so use the defaults for this survivor's type
            const typeInfo = survivorTypes.find(
              (t) => t.name === survivor.type?.toUpperCase()
            );
            const attributes = typeInfo?.attributes ?? {};
            const skills = survivor.skills ?? [];
            const gear = survivor.gear ?? [];
    
            return (
              <article
                key={survivor.id}
                className="bg-neutral-primary-soft flex w-full flex-col border border-default p-4 shadow-xs"
              >
                <h3 className="mb-1 text-xl font-semibold tracking-tight text-heading">
                  {survivor.name} - {formatEnum(survivor.type)}
                </h3>
               
    
                {Object.keys(attributes).length > 0 && (
                  <>
                    <h4 className="mb-1 text-sm font-semibold text-heading">Attributes</h4>
                    <dl className="mb-3 space-y-1.5 text-xs text-body">
                      {Object.entries(attributes).map(([attribute, value]) => (
                        <div
                          className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-2"
                          key={attribute}
                        >
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
                  </>
                )}
    
                {(skills.length > 0 || gear.length > 0) && (
                    <div className="mb-3 grid grid-cols-2 gap-4">
                        <div>
                        <h4 className="mb-1 text-sm font-semibold text-heading">Skills</h4>
                        {skills.length > 0 ? (
                            <ul className="list-inside list-disc text-xs leading-5 text-body">
                            {skills.map((skill) => (
                                <li key={skill}>{formatEnum(skill)}</li>
                            ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-body">None</p>
                        )}
                        </div>

                        <div>
                        <h4 className="mb-1 text-sm font-semibold text-heading">Gear</h4>
                        {gear.length > 0 ? (
                            <ul className="space-y-1 text-xs leading-5 text-body">
                            {gear.map((item) => {
                                const stats = [
                                item.damage != null && `Dmg ${item.damage}`,
                                item.durability != null && `Dur ${item.durability}`,
                                item.weight != null && `Wt ${item.weight}`,
                                ].filter(Boolean).join(" · ");

                                return (
                                <li key={item.id}>
                                    <span className="text-heading">{item.name}</span>
                                    {stats && <span className="block text-[11px] opacity-80">{stats}</span>}
                                </li>
                                );
                            })}
                            </ul>
                        ) : (
                            <p className="text-xs text-body">None</p>
                        )}
                        </div>
                    </div>
                    )}
    
              </article>
            );
          })}
        </div>
  )
}