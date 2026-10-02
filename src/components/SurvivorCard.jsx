import '../css/SurvivorCard.css'

import { survivorTypes } from "../components/SurvivorType.js";

function formatEnum(value) {
    return String(value)
        .toLowerCase()
        .split(/[_\s]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export default function SurvivorCard({ survivor, isYou }) {
    const skills = survivor.skills ?? []

      const survivorType = survivorTypes.find(
          (type) => type.name === survivor.type?.toUpperCase(),
      );


    return (
        <div className={`survivor-card ${isYou ? "survivor-card-you" : ""}`}>
            <div className="survivor-card-avatar">
                <img
                    src={survivorType?.image}
                    alt={`${survivor.name.toLowerCase()} survivor`}
                />
            </div>
            <div className="survivor-card-info">
                <div className="survivor-card-name-row">
                    <h2 className="survivor-card-name">{survivor.name}</h2>
                    {isYou && (
                        <span className="survivor-card-you-badge">YOU</span>
                    )}
                </div>
                <p className="survivor-card-subtitle">
                    {formatEnum(survivor.type)}
                    {survivor.username ? ` · ${survivor.username}` : ""}
                </p>
                {skills.length > 0 && (
                    <p className="survivor-card-skills">
                        {skills.map(formatEnum).join(", ")}
                    </p>
                )}
            </div>
        </div>
    );
}
