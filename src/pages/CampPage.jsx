import '../css/CampPage.css'
import { getAllSurvivors } from '../service/survivor-service'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ShowAllSurvivors from '../components/ShowAllSurvivors'
import CampChat from '../components/CampChat'


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
        <div className="camp-page">
            <header className="camp-page-header">
                <div>
                    <p className="camp-page-kicker">SAFE ZONE</p>
                    <h1>Camp</h1>
                </div>
                <p className="camp-page-intro">Catch your breath. Check in with the people who made it back.</p>
            </header>

            <div className="camp-page-content">
                <CampChat survivorName={mySurvivor?.name ?? 'Survivor'} />
                <section className="camp-roster" aria-labelledby="camp-roster-title">
                    <div className="camp-section-heading">
                        <div>
                            <p className="camp-page-kicker">THE SHELTER</p>
                            <h2 id="camp-roster-title">Survivors</h2>
                        </div>
                        <span className="camp-roster-count">{otherSurvivors.length + (mySurvivor ? 1 : 0)}</span>
                    </div>
                    <ShowAllSurvivors mySurvivor={mySurvivor} otherSurvivors={otherSurvivors} />
                </section>
            </div>
        </div>
    )
}
