import "../css/ActionPage.css";

// Lock icon based on Lucide (lucide.dev, ISC license); shown when items are missing
function LockIcon() {
    return (
        <svg
            className="action-entry-lock"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

export default function ActionSelectOption({ action, selected, onActionClicked }) {
    const requirements = action.requirements ?? [];
    const isLocked = requirements.some((requirement) => !requirement.owned);

    return (
        <button
            type="button"
            onClick={onActionClicked}
            className={`action-entry ${selected ? "action-entry-active" : "action-entry-inactive"}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`flex items-center gap-2 font-russo text-sm ${selected ? "text-primary" : "text-text"}`}>
                        {action.name}
                        {isLocked && <LockIcon />}
                    </p>
                    <p className="action-entry-effect">{action.effect}</p>

                    {requirements.length > 0 && (
                        <ul className="action-requirements" aria-label="Required items">
                            {requirements.map((requirement) => (
                                <li
                                    key={requirement.label}
                                    className={`action-requirement ${requirement.owned ? "action-requirement-owned" : "action-requirement-missing"}`}
                                >
                                    <span aria-hidden="true">{requirement.owned ? "✓" : "✕"}</span>
                                    {requirement.label}
                                    <span className="sr-only">{requirement.owned ? "(you have this)" : "(missing)"}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {selected && <div className="action-entry-indicator animate-pulse-red" />}
            </div>
        </button>
    );
}
