import ShowSurvivorAttributes from "../components/SurvivorPage/SurvivorAttributesComponent";
import ShowSurvivorGear from "../components/SurvivorPage/SurvivorGearComponent";
import ShowSurvivorSkill from "../components/SurvivorPage/SurvivorSkillComponent";
import "../css/CampPage.css";

export default function SurvivorPage() {
  return (
    <>
      <h1>SurvivorPage</h1>
      <ShowSurvivorAttributes/>
      <ShowSurvivorGear/>
      <ShowSurvivorSkill/>
    </>
  );
}
