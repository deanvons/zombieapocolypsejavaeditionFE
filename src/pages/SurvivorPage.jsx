import { useEffect, useState } from "react";
import keycloak from "../../keycloak";
import ShowSurvivorAttributes from "../components/SurvivorPage/SurvivorAttributesComponent";
import ShowSurvivorGear from "../components/SurvivorPage/SurvivorGearComponent";
import ShowSurvivorSkill from "../components/SurvivorPage/SurvivorSkillComponent";
import { survivorTypes } from "../components/SurvivorType.js";

const API_URL = import.meta.env.VITE_API_URL;

export default function SurvivorPage() {
  const [survivor, setSurvivor] = useState(null);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSurvivor() {
      try {
        await keycloak.updateToken(30);
        const headers = { Authorization: `Bearer ${keycloak.token}` };
        const requestedId = new URLSearchParams(window.location.search).get("id");
        let survivorId = requestedId;

        if (!survivorId) {
          const listResponse = await fetch(`${API_URL}/api/survivors`, { headers });
          if (!listResponse.ok) {
            throw new Error(`Could not load survivors (${listResponse.status})`);
          }
          const survivors = await listResponse.json();
          survivorId = survivors[0]?.id;
        }

        if (!survivorId) {
          setSurvivor(null);
          return;
        }

        const [survivorResponse, gearResponse, attributesResponse, skillsResponse] = await Promise.all([
          fetch(`${API_URL}/api/survivors/${survivorId}`, { headers }),
          fetch(`${API_URL}/api/survivors/${survivorId}/gear`, { headers }),
          fetch(`${API_URL}/api/survivors/${survivorId}/attributes`, { headers }),
          fetch(`${API_URL}/api/survivors/${survivorId}/skills`, { headers }),
        ]);

        const responses = [survivorResponse, gearResponse, attributesResponse, skillsResponse];
        const failedResponse = responses.find((response) => !response.ok);
        if (failedResponse) {
          throw new Error(`Could not load survivor details (${failedResponse.status})`);
        }

        const [survivorData, gear, attributes, skills] = await Promise.all(
          responses.map((response) => response.json())
        );
        setSurvivor(survivorData);
        setDetails({ gear, attributes, skills });
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

  const attributes = details.attributes && Object.keys(details.attributes).length > 0
    ? details.attributes
    : survivorTypes.find((type) => type.name === survivor.type?.toUpperCase())?.attributes ?? {};

  return (
    <main>
      <h1>{survivor.name} - {survivor.type}</h1>
      <ShowSurvivorAttributes attributes={attributes} />
      <ShowSurvivorGear gear={details.gear} />
      <ShowSurvivorSkill skills={details.skills} />
    </main>
  );
}
