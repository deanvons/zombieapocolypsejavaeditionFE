import '../css/SurvivorCard.css'

function formatEnum(value) {
    return String(value)
        .toLowerCase()
        .split(/[_\s]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export default function SurvivorCard({ survivor, isYou }) {
    const skills = survivor.skills ?? []

    return (
        <div className={`survivor-card ${isYou ? 'survivor-card-you' : ''}`}>
            <div className="survivor-card-avatar" />
            <div>
                <div className="survivor-card-name-row">
                    <h2 className="survivor-card-name">{survivor.name}</h2>
                    {isYou && <span className="survivor-card-you-badge">YOU</span>}
                </div>
                <p className="survivor-card-subtitle">
                    {formatEnum(survivor.type)}
                    {survivor.username ? ` · ${survivor.username}` : ''}
                </p>
                {skills.length > 0 && (
                    <p className="survivor-card-skills">{skills.map(formatEnum).join(', ')}</p>
                )}
            </div>
        </div>
    )
}
