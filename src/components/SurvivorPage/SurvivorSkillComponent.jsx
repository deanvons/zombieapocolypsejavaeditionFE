export default function ShowSurvivorSkill({ skills = [] }) {
    return (
        <div>
            <h2>Skills</h2>
            {skills.length ? (
                <ul>
                    {skills.map((skill, index) => (
                        <li key={skill.id ?? skill.name ?? index}>
                            {typeof skill === "string" ? skill : skill.name ?? skill.type ?? JSON.stringify(skill)}
                        </li>
                    ))}
                </ul>
            ) : <p>No skills.</p>}
        </div>
    )
}