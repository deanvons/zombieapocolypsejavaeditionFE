import "../css/ActionPage.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllActions } from "../service/action-service.js";
import { getMySurvivor, performAction } from "../service/survivor-service.js";
import { setSurvivor } from "../redux/slices/survivor/survivorSlice.js";

import ActionSelector from "../components/ActionSelector.jsx";
import ActionResult from "../components/ActionResult.jsx";

// A requirement ({ type: "tool" | "weapon", name }) is met by a gear item of the same type
// and, when a name is given, the same name. name: null means "any item of that type".
function hasRequiredItem(gear, requirement) {
  return gear.some(
    (item) =>
      item.type?.toLowerCase() === requirement.type?.toLowerCase() &&
      (requirement.name == null || item.name?.toLowerCase() === requirement.name.toLowerCase()),
  );
}

// Adds a display label and whether the survivor has it; actions without requiredItems have no requirements
function requirementsWithStatus(action, gear) {
  return (action.requiredItems ?? []).map((requirement) => ({
    ...requirement,
    label: requirement.name ?? `Any ${requirement.type}`,
    owned: hasRequiredItem(gear, requirement),
  }));
}

export default function ActionPage() {
  const dispatch = useDispatch();
  const survivor = useSelector((state) => state.survivor.survivor);
  const survivorId = survivor?.id ?? null;
  const gear = survivor?.gear ?? [];

  const [actions, setActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);

  const [effectiveness, setEffectiveness] = useState(null);
  // This is vibe coded.
  const [resultRunKey, setResultRunKey] = useState(0);
  const [resultActionType, setResultActionType] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => {
    async function loadActions() {
      try {
        setActions(await getAllActions());
      } catch (e) {
        console.error(e);
      }
    }

    // Refresh the survivor so the required-items check uses the latest gear
    async function refreshSurvivor() {
      try {
        const latestSurvivor = await getMySurvivor();
        if (latestSurvivor) dispatch(setSurvivor(latestSurvivor));
      } catch (e) {
        console.error(e);
      }
    }

    loadActions();
    refreshSurvivor();
  }, [dispatch]);

  const actionsWithRequirements = actions.map((action) => ({
    ...action,
    requirements: requirementsWithStatus(action, gear),
  }));
  const selectedRequirements =
    actionsWithRequirements.find((action) => action.id === selectedAction?.id)?.requirements ?? [];
  const missingItems = selectedRequirements.filter((requirement) => !requirement.owned);

  async function handlePerformAction(actionId) {
    if (survivorId === null) {
      setErrorMessage("No survivor found for your account.");
      return;
    }

    if (missingItems.length > 0) {
      return;
    }

    const action = actions.find((a) => a.id === actionId);

    try {
      setErrorMessage(null);
      const result = await performAction(survivorId, actionId);
      setEffectiveness(result.effectiveness);
      // This is vibe coded: pass the action type so its matching sound plays.
      setResultActionType(action?.name?.toLowerCase() ?? null);
      setResultRunKey((key) => key + 1);
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message);
    }
  }

  return (
    <>
    <div className="m-8">
      <h1 className="action-title">Perform an Action</h1>
      <h2 className="action-subtitle">Pick an action to see how well {survivor?.name ?? "you"} will do.</h2>
      {survivor === null && <p className="action-error">No survivor found for your account.</p>}
      {errorMessage && <p className="action-error">{errorMessage}</p>}
      <div className="flex flex-col md:flex-row">
          <ActionSelector
            actions={actionsWithRequirements}
            selected={selectedAction}
            onActionClicked={setSelectedAction}
            onPerformClicked={handlePerformAction}
            canPerform={survivorId !== null && missingItems.length === 0}
            missingItems={missingItems}
          />
          <ActionResult
            effectiveness={effectiveness}
            resultRunKey={resultRunKey}
            actionType={resultActionType}
          />
      </div>
    </div>
    </>
  );
}
