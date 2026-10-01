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
        <div className={`flex items-start gap-4 rounded-lg border p-4 ${isYou ? 'border-2' : ''}`}>
            <div className="h-12 w-12 shrink-0 rounded-full bg-neutral-200" />
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{survivor.name}</h2>
                    {isYou && (
                        <span className="rounded-full bg-black px-2 py-0.5 text-xs font-semibold text-white">
                            YOU
                        </span>
                    )}
                </div>
                <p className="text-sm text-neutral-500">
                    {formatEnum(survivor.type)}
                    {survivor.username ? ` · ${survivor.username}` : ''}
                </p>
                {skills.length > 0 && (
                    <p className="mt-1 text-sm text-neutral-500">{skills.map(formatEnum).join(', ')}</p>
                )}
            </div>
        </div>
    )
}
