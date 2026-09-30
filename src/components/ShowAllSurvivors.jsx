


export default function ShowAllSurvivors({ mySurvivor, otherSurvivors }) {
    const allSurvivors = mySurvivor ? [mySurvivor, ...otherSurvivors] : otherSurvivors

    if (allSurvivors.length === 0) {
        return <div>No survivors found</div>
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allSurvivors.map((survivor) => {
                const isYou = survivor.id === mySurvivor?.id
                const skills = survivor.skills ?? []

                return (
                    <div
                        key={survivor.id}
                        className={`flex items-start gap-4 rounded-lg border p-4 ${isYou ? 'border-2' : ''}`}
                    >
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
                                <p className="mt-1 text-sm text-neutral-500">
                                    {skills.map(formatEnum).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}