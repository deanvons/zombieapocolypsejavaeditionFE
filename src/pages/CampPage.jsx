import '../css/CampPage.css'
import { getAllSurvivors } from '../service/survivor-service'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ShowAllSurvivors from '../components/ShowAllSurvivors'


export default function CampPage() {
    const mySurvivor = useSelector((state) => state.survivor.survivor);
    const [ allSurvivors, setAllSurvivors ] = useState([]);

    useEffect(() => {
        async function loadSurvivors() {
            setAllSurvivors(await getAllSurvivors());
        }
        loadSurvivors();
    }, [])

    const otherSurvivors = mySurvivor
        ? allSurvivors.filter((survivor) => survivor.id !== mySurvivor.id)
        : allSurvivors

    return (
        <>
            <h1>Welcome to camp</h1>

            <ShowAllSurvivors mySurvivor={mySurvivor} otherSurvivors={otherSurvivors} />
        </>
    )
}
