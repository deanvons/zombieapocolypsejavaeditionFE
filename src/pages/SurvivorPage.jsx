import { useEffect, useState } from "react";
import ShowSurvivorAttributes from "../components/SurvivorPage/SurvivorAttributesComponent";
import ShowSurvivorGear from "../components/SurvivorPage/SurvivorGearComponent";
import ShowSurvivorSkill from "../components/SurvivorPage/SurvivorSkillComponent";
import { survivorTypes } from "../components/SurvivorType.js";
import { getMySurvivor } from "../service/survivor-service.js";

export default function SurvivorPage() {
  const [survivor, setSurvivor] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSurvivor() {
      try {
        const survivorResponse = await getMySurvivor();
        setSurvivor(survivorResponse);
      } catch (fetchError) {
        setError(fetchError.message || "Could not load survivor details.");
      } finally {
        setLoading(false);
      }
    }

    loadSurvivor();
  }, []);

  if (loading) return <p>Loading survivor...</p>;
  if (error) return <p role="alert">{error}</p>;
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
