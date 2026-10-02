import { useSelector } from "react-redux";
import ShowSurvivorAttributes from "../components/SurvivorPage/SurvivorAttributesComponent";
import ShowSurvivorGear from "../components/SurvivorPage/SurvivorGearComponent";
import ShowSurvivorSkill from "../components/SurvivorPage/SurvivorSkillComponent";
import { survivorTypes } from "../components/SurvivorType.js";

export default function SurvivorPage() {
  const survivor = useSelector((state) => state.survivor.survivor);

  if (!survivor) return <p>No survivor found.</p>;

  // Fallback to default attributes for class if there is no attributes
  const attributes =
    survivor.attributes && Object.keys(survivor.attributes).length > 0
      ? details.attributes
      : (survivorTypes.find(
          (type) => type.name === survivor.type?.toUpperCase(),
        )?.attributes ?? {});

  return (
    <main>
      <h1>
        {survivor.name} - {survivor.type}
      </h1>
      <ShowSurvivorAttributes attributes={attributes} />
      <ShowSurvivorGear gear={survivor.gear} />
      <ShowSurvivorSkill skills={survivor.skills} />
    </main>
  );
}
