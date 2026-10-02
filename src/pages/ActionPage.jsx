import "../css/ActionPage.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getAllActions } from "../service/action-service.js";
import { performAction } from "../service/survivor-service.js";

import ActionSelector from "../components/ActionSelector.jsx";
import ActionResult from "../components/ActionResult.jsx";

export default function ActionPage() {
  const navigate = useNavigate();
  const survivor = useSelector((state) => state.survivor.survivor);
  const survivorId = survivor?.id ?? null;

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

    loadActions();
  }, []);

  async function handlePerformAction(actionId) {
    if (survivorId === null) {
      setErrorMessage("No survivor found for your account.");
      return;
    }

    // Scavenge has its own page instead of an effectiveness score here
    const action = actions.find((a) => a.id === actionId);
    if (action?.name === "Scavenge") {
      navigate("/scavenge");
      return;
    }

    try {
      setErrorMessage(null);
      const result = await performAction(survivorId, actionId); 
      setEffectiveness(result.effectiveness);
      // This is vibe coded: pass the action type so its matching sound plays.
      setResultActionType(actionType);
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
          <ActionSelector actions={actions} selected={selectedAction} onActionClicked={setSelectedAction} onPerformClicked={handlePerformAction} canPerform={survivorId !== null} />
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
