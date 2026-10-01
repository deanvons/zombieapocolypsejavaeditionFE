import SurvivorCard from './SurvivorCard'

export default function ShowAllSurvivors({ mySurvivor, otherSurvivors }) {
    const allSurvivors = mySurvivor ? [mySurvivor, ...otherSurvivors] : otherSurvivors

    if (allSurvivors.length === 0) {
        return <div>No survivors found</div>
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allSurvivors.map((survivor) => (
                <SurvivorCard
                    key={survivor.id}
                    survivor={survivor}
                    isYou={survivor.id === mySurvivor?.id}
                />
            ))}
        </div>
    )
}
