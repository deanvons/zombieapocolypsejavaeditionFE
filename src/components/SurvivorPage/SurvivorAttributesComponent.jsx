// Display order; the backend sends lowercase names, the class defaults in SurvivorType.js are capitalized
const ATTRIBUTE_ORDER = ["strength", "endurance", "agility", "courage", "intelligence", "leadership", "trustworthiness"];
const MAX_VALUE = 10;

export default function ShowSurvivorAttributes({ attributes = {} }) {
    const valuesByName = Object.fromEntries(
        Object.entries(attributes).map(([name, value]) => [name.toLowerCase(), value])
    );
    const rows = ATTRIBUTE_ORDER.filter((name) => valuesByName[name] != null);

    return (
        <section>
            <header className="flex items-baseline justify-between gap-4 mb-6">
                <h2 className="survivor-section-title">Attributes</h2>
            </header>
            {rows.length ? (
                <dl className="space-y-3">
                    {rows.map((name) => {
                        const value = valuesByName[name];
                        const percent = Math.min(value / MAX_VALUE, 1) * 100;

                        return (
                            <div
                                key={name}
                                className="grid grid-cols-[8rem_minmax(0,1fr)_2rem] md:grid-cols-[10rem_minmax(0,1fr)_2.5rem] items-center gap-4"
                            >
                                <dt className="survivor-attribute-label">{name}</dt>
                                <dd
                                    role="meter"
                                    aria-label={name}
                                    aria-valuemin={0}
                                    aria-valuemax={MAX_VALUE}
                                    aria-valuenow={value}
                                    className="survivor-attribute-track"
                                >
                                    <div className="survivor-attribute-fill" style={{ width: `${percent}%` }} />
                                </dd>
                                <dd className="survivor-attribute-value">{value}</dd>
                            </div>
                        );
                    })}
                </dl>
            ) : <p className="survivor-empty">No attributes.</p>}
        </section>
    )
}
