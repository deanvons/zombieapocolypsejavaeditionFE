import "../css/ActionPage.css";
import { Link } from "react-router";
import ActionSelectOption from "../components/ActionSelectOption.jsx";

export default function ActionSelector({actions, onActionClicked, onPerformClicked, selected, canPerform, missingItems = []}) {

    return (
        // This is vibe coded: match the softened border on the result panel.
        <div className="flex flex-col action-card action-panel-soft-border gap-1">
            <h3 className="action-card-title">Actions</h3>
            <p className="action-card-description">Select an action you want to perform</p>
            {actions.map((action) => (
                <ActionSelectOption
                    key={action.id}
                    action={action}
                    selected={action.id === selected?.id}
                    onActionClicked={() => onActionClicked(action)}
                />
            ))}
            {/* Missing items replace the Perform button */}
            {missingItems.length > 0 ? (
                <div className="px-8 md:px-18 pt-4">
                    <div className="action-missing-box" role="alert">
                        <p className="action-missing-title">You do not have the required items</p>
                        <p className="action-missing-list">
                            Missing: {missingItems.map((item) => item.label).join(", ")}
                        </p>
                        <Link to="/scavenge" className="action-missing-link">
                            Go scavenging →
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex pt-4 px-8 md:px-18 items-center">
                    <button
                        className="group action-entry action-entry-inactive enabled:hover:border-primary/60 enabled:hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
                        type="button"
                        disabled={!selected || !canPerform}
                        onClick={() => onPerformClicked(selected.id)}
                    >
                        <p className="font-russo text-sm text-text group-enabled:group-hover:text-primary">
                            Perform Action
                        </p>
                    </button>
                </div>
            )}
        </div>
    )
}
