import { useState } from "react"
import "../css/SettingsPage.css";


const difficulties = [
    {value: 'easy', label: 'Easy', desc: 'More scavenging, less zombies.'},
    {value: 'normal', label: 'Normal', desc: 'Balanced challenge. Recommended'},
    {value: 'hard', label: 'Hard', desc: 'Harder to find resources. Relentless zombies.'}
]


//will need to add defaultsettings object for this and fetch savedGame

export default function SettingsPage({settings = {difficulty: 'normal'}, savedGame, onChange, onDeleteSave, onNavigate}){
const [confirmDelete, setConfirmDelete] = useState(false)

const handleDelete = () => {
    onDeleteSave()
    setConfirmDelete(false)
}

return(
    <div className="flex-1 max-w-xl mx-auto w-full px-8 py-12">
        <h1 className="font-russo text-3xl text-text mb-10 tracking-wide">Settings</h1>

        <section className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-text-dim mb-4">Difficulty</p>
            <div className="space-y-2">
                {difficulties.map(d => (
                    <button
                    key={d.value}
                    onClick={() => onChange({...settings, difficulty: d.value})}
                    className={`w-full text-left p-4 rounded-sm-border transition-all duration-150 cursor-pointer
                        ${settings.difficulty === d.value
                            ? 'border-primary/60 bg-primary/5'
                            : 'border-border bg-panel hover:border-border-bright'}`}>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`font-russo text-sm ${settings.difficulty === d.value ? 'text-primary' : 'text-text'}`}>
                                            {d.label}
                                        </p>
                                        <p className="font-mono text-xs text-text-dim mt-0.5">{d.desc}</p>
                                    </div>
                                    {settings.difficulty === d.value && (
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-red shrink-0 ml-4" />
                                    )}
                                </div>
                            </button>
                ))}
            </div>
        </section>

        <section>
            <p className="font-mono text-xs uppercase tracking-widest text-text--dim mb-4">Save File</p>
            <div className="border border-border rounded-sm bg-panel p-4">
                {savedGame ? (
                    <>
                    <div className="flex items-center gap-3 mb-4 border-b border-border">
                        <div>
                        <p className="font-russo text-sm text-text">{savedGame.survivorName}</p>
                        <p className="font-mono text-xs text-text-dim">
                            {savedGame.survivorTitle}
                        </p>
                        </div>
                    </div>

                    {confirmDelete ? (
                        <div className="space-y-3">
                            <p className="font-mono text-xs text-primary">
                                Delete this save? This cannot be undone.
                            </p>
                            <div className="flex gap-2">
                                <button onClick={handleDelete}
                                className="flex-1 py-2 font-russo text-xs tracking-widest uppercase border border-primary/60 text-primary hover:bg-primary/10 rounded-sm transition-colors cursor-pointer">
                                    Yes, delete
                                </button>
                                <button
                                onClick={() => setConfirmDelete(false)}
                                className="flex-1 py-2 font-russo text-xs tracking-widest uppercase border border-border text-text-dim hover:border-border-bright rounded-sm transition-colors cursor-pointer">
                                    Cancel
                                </button>
                            </div>
                        </div> ):(
                            <button
                            onClick={() => setConfirmDelete(true)}
                            className="w-full py-2 font-russo text-xs tracking-widest uppercase border border-border text-text-dim hover:border-primary/60 hover:text-primary rounded-sm transition-colors cursor-pointer">
                                Delete saved file
                            </button>
                        )}
                    </>
                ):(
                    <p className="font-mono text-xs text-text-dim text-center py-2">No saved file found</p>
                )}
            </div>
        </section>
    </div>

)

}