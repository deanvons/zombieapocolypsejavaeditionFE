export default function ShowSurvivorGear({ gear = [] }) {
    return (
        <div>
            <h2>Gear</h2>
            {gear.length ? (
                <ul>
                    {gear.map((item) => (
                        <li key={item.id}>
                            {item.name} ({item.type}) - Weight: {item.weight}, Durability: {item.durability}, Damage: {item.damage}
                        </li>
                    ))}
                </ul>
            ) : <p>No gear.</p>}
        </div>
    )
}