import "../css/SurvivorPage.css";

import { useSelector } from "react-redux";
import ShowSurvivorAttributes from "../components/SurvivorPage/SurvivorAttributesComponent";
import ShowSurvivorGear from "../components/SurvivorPage/SurvivorGearComponent";
import ShowSurvivorSkill from "../components/SurvivorPage/SurvivorSkillComponent";
import { survivorTypes } from "../components/SurvivorType.js";

export default function SurvivorPage() {
  const survivor = useSelector((state) => state.survivor.survivor);

  if (!survivor) return <p>No survivor found.</p>;

  const survivorType = survivorTypes.find(
    (type) => type.name === survivor.type?.toUpperCase(),
  );

  // Use the survivor's own attributes, or the defaults for its class if it has none
  const attributes =
    survivor.attributes && Object.keys(survivor.attributes).length > 0
      ? survivor.attributes
      : (survivorType?.attributes ?? {});

  // Same formula as the backend's Survivor.getMaxLoad(); the API doesn't send it
  const strength = attributes.strength ?? attributes.Strength;
  const maxLoad = strength != null ? 10 + strength * 3 : undefined;

  return (
    <div className="py-4 px-8">
      <article className="survivor-page-card flex flex-col gap-8">
        <header className="flex flex-col sm:flex-row items-center gap-6">
          <div className="survivor-avatar">
            <img
              src={survivorType?.image}
              alt={`${survivor.name.toLowerCase()} survivor`}
            />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="survivor-page-name">{survivor.name}</h1>
            <p className="survivor-type-tag">{survivor.type}</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-22">
          <ShowSurvivorAttributes attributes={attributes} />
          <div className="flex flex-col gap-8">
            <ShowSurvivorSkill skills={survivor.skills} />
            <ShowSurvivorGear gear={survivor.gear} maxLoad={maxLoad} />
          </div>
        </div>
      </article>
    </div>
  );
}
