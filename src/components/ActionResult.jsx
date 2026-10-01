import "../css/ActionPage.css";

export default function ActionResult({effectiveness}) {

    return (
        <div className="action-card flex flex-col">
            <h3 className="action-card-title">Result</h3>
            <div className="flex flex-1 items-center justify-center">
                { effectiveness != null ? (
                    <div className="flex flex-col items-center">
                        <p className="action-title">Effectiveness: </p>
                        <p className="action-result-score">{Math.round(effectiveness)}</p>
                    </div>
                ) : (
                    <p className="font-russo text-sm text-center px-24">Select and perform an action to see its effectiveness</p>
                )}
            </div>
        </div>
    )
}
