import { useState } from "react"
import "../css/SettingsPage.css";


const difficulties = [
    {value: 'easy', label: 'Easy', desc: 'More scavenging, less zombies.'},
    {value: 'normal', label: 'Normal', desc: 'Balanced challenge. Recommended'},
    {value: 'hard', label: 'Hard', desc: 'Harder to find resources. Relentless zombies.'}
]


//will need to add defaultsettings object for this (now its not possible to change) and fetch savedGame

export default function SettingsPage({settings = {difficulty: 'normal'}, savedGame, onChange, onDeleteSave, onNavigate}){
const [confirmDelete, setConfirmDelete] = useState(false)

const handleDelete = () => {
    onDeleteSave()
    setConfirmDelete(false)
}

return(
    <div className="settings-maincontent">
        <h1 className="settings-title">Settings</h1>

        <section className="mb-10">
            <p className="settings-option-title">Difficulty</p>
            <div className="space-y-2">
                {difficulties.map(d => (
                    <button
                    key={d.value}
                    onClick={() => onChange({...settings, difficulty: d.value})}
                    className={`difficulty-card
                        ${settings.difficulty === d.value
                            ? 'difficulty-card-active'
                            : 'difficulty-card-disabled'}`}>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`font-russo text-sm ${settings.difficulty === d.value ? 'text-primary' : 'text-text'}`}>
                                            {d.label}
                                        </p>
                                        <p className="difficulty-card-description">{d.desc}</p>
                                    </div>
                                    {settings.difficulty === d.value && (
                                        <div className="difficulty-indicator animate-pulse-red " />
                                    )}
                                </div>
                            </button>
                ))}
            </div>
        </section>

        <section>
            <p className="settings-option-title">Save File</p>
            <div className="save-card">
                {savedGame ? (
                    <>
                    <div className="save-card-header">
                        <div>
                        <p className="save-card-name">{savedGame.survivorName}</p>
                        <p className="save-card-title">
                            {savedGame.survivorTitle}
                        </p>
                        </div>
                    </div>

                    {confirmDelete ? (
                        <div className="space-y-3">
                            <p className="save-card-warning">
                                Delete this save? This cannot be undone.
                            </p>
                            <div className="flex gap-2">
                                <button onClick={handleDelete}
                                className="delete-danger-button">
                                    Yes, delete
                                </button>
                                <button
                                onClick={() => setConfirmDelete(false)}
                                className="delete-cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </div> ):(
                            <button
                            onClick={() => setConfirmDelete(true)}
                            className="delete-button">
                                Delete saved file
                            </button>
                        )}
                    </>
                ):(
                    <p className="save-card-empty">No saved file found</p>
                )}
            </div>
        </section>
    </div>

)

}