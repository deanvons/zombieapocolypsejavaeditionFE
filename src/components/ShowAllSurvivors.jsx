import SurvivorCard from './SurvivorCard'

export default function ShowAllSurvivors({ mySurvivor, otherSurvivors }) {
    const allSurvivors = mySurvivor ? [mySurvivor, ...otherSurvivors] : otherSurvivors

    if (allSurvivors.length === 0) {
        return <div>No survivors found</div>
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(14.5rem),1fr))] gap-4">
            {allSurvivors.map((survivor) => (
                <SurvivorCard
                    key={survivor.id}
                    survivor={survivor}
                    isYou={survivor.id === mySurvivor?.id}
                />
            ))}
        </div>
    );
}
