// "TOOL" / "tool" -> "Tool"
function formatKind(type = "") {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export default function ShowSurvivorGear({ gear = [], maxLoad, onDeleteItem, deletingItemId }) {
    // Round to avoid float noise like 0.30000000000000004
    const totalWeight = Math.round(gear.reduce((sum, item) => sum + (item.weight ?? 0), 0) * 10) / 10;

    return (
        <section className="survivor-panel">
            <header className="flex items-baseline justify-between gap-4 mb-6">
                <h2 className="survivor-section-title">Gear</h2>
                <p className="survivor-gear-load">
                    Load <span className="survivor-gear-number">
                        {totalWeight}{maxLoad != null && ` / ${maxLoad}`} kg
                    </span>
                </p>
            </header>

            {gear.length ? (
                <table className="survivor-gear-table">
                    <thead>
                        <tr>
                            <th className="survivor-gear-heading w-[45%]">Item</th>
                            <th className="survivor-gear-heading">Kind</th>
                            <th className="survivor-gear-heading text-right">Weight</th>
                            {onDeleteItem && <th className="survivor-gear-heading"><span className="sr-only">Delete</span></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {gear.map((item) => (
                            <tr key={item.id} className="survivor-gear-row">
                                <td className="survivor-gear-cell">{item.name}</td>
                                <td className="survivor-gear-cell">{formatKind(item.type)}</td>
                                <td className="survivor-gear-cell text-right">
                                    <span className="survivor-gear-number">{item.weight} kg</span>
                                </td>
                                {onDeleteItem && (
                                    <td className="survivor-gear-cell text-right pl-4">
                                        <button
                                            type="button"
                                            className="survivor-gear-delete"
                                            disabled={deletingItemId === item.id}
                                            onClick={() => onDeleteItem(item)}
                                            aria-label={`Delete ${item.name}`}
                                        >
                                            {deletingItemId === item.id ? "..." : "Delete"}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p className="survivor-empty">No gear.</p>}
        </section>
    )
}
