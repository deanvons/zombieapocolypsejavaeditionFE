export default function ShowSurvivorAttributes({ attributes = {} }) {
    return (
        <div>
            <h2>Attributes</h2>
            {Object.keys(attributes).length ? (
                <ul>
                    {Object.entries(attributes).map(([name, value]) => (
                        <li key={name}>{name}: {value}</li>
                    ))}
                </ul>
            ) : <p>No attributes.</p>}
        </div>
    )
}