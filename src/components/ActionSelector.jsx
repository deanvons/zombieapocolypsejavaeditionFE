import "../css/ActionPage.css";
import ActionSelectOption from "../components/ActionSelectOption.jsx";

export default function ActionSelector({actions, onActionClicked, onPerformClicked, selected}) {

    return (
        <div className="flex flex-col action-card gap-1">
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
            <div className="flex pt-4 px-8 md:px-18 items-center">
                <button
                    className="group action-entry action-entry-inactive enabled:hover:border-primary/60 enabled:hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
                    type="button"
                    disabled={!selected}
                    onClick={() => onPerformClicked(selected.id)}
                >
                    <p className="font-russo text-sm text-text group-enabled:group-hover:text-primary">
                        Perform Action
                    </p>
                </button>
            </div>
        </div>
    )
}
