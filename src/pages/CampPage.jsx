import '../css/CampPage.css'
import { getAllSurvivors, getMySurvivor } from '../service/survivor-service'
import { useEffect, useState } from 'react'
import ShowAllSurvivors from '../components/ShowAllSurvivors'

function formatEnum(value) {
    return String(value)
        .toLowerCase()
        .split(/[_\s]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export default function CampPage() {
    const [ mySurvivor, setMySurvivor ] = useState(null);
    const [ otherSurvivors, setOtherSurvivors ] = useState([]);

    useEffect(() => {
        async function loadSurvivors() {
            const [allSurvivors, mySurvivor] = await Promise.all([
                getAllSurvivors(),
                getMySurvivor(),
            ])
            setMySurvivor(mySurvivor);
            const otherSurvivors = mySurvivor
                ? allSurvivors.filter((survivor) => survivor.id !== mySurvivor.id)
                : allSurvivors
            setOtherSurvivors(otherSurvivors);
        }
        loadSurvivors();
    }, [])

    return (
        <>
            <h1>Welcome to camp</h1>

            <ShowAllSurvivors mySurvivor={mySurvivor} otherSurvivors={otherSurvivors} />
        </>
    )
}
