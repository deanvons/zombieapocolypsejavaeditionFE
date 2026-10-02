import "../css/ActionPage.css";

export default function ActionSelectOption({ action, selected, onActionClicked }) {
    return (
        <button
            type="button"
            onClick={onActionClicked}
            className={`action-entry ${selected ? "action-entry-active" : "action-entry-inactive"}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`font-russo text-sm ${selected ? "text-primary" : "text-text"}`}>
                        {action.name}
                    </p>
                    <p className="action-entry-effect">{action.effect}</p>
                </div>
                {selected && <div className="action-entry-indicator animate-pulse-red" />}
            </div>
        </button>
    );
}
