function skillName(skill) {
    const name = typeof skill === "string" ? skill : skill.name ?? skill.type ?? JSON.stringify(skill);
    // Backend sends enum names like "FieldMedicine" -> "Field Medicine"
    return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export default function ShowSurvivorSkill({ skills = [] }) {
    return (
        <section className="survivor-panel">
            <header className="flex items-baseline justify-between gap-4 mb-6">
                <h2 className="survivor-section-title">Skills</h2>
            </header>
            {skills.length ? (
                <ul className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                        <li key={skillName(skill)} className="survivor-skill-chip">
                            {skillName(skill)}
                        </li>
                    ))}
                </ul>
            ) : <p className="survivor-empty">No skills.</p>}
        </section>
    )
}
