import "../css/ActionPage.css";
import { useEffect, useState } from "react";
import { getAllActions } from "../service/action-service.js";
import { getMySurvivor, performAction } from "../service/survivor-service.js";

import ActionSelector from "../components/ActionSelector.jsx";
import ActionResult from "../components/ActionResult.jsx";


export default function ActionPage() {
  const [survivorId, setSurvivorId] = useState(null);
  
  const [actions, setActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);

  const [effectiveness, setEffectiveness] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => {
    async function loadActions() {
      try {
        setActions(await getAllActions());
      } catch (e) {
        console.error(e);
      }
    }

    async function loadSurvivor() {
      try {
        const survivor = await getMySurvivor();
        if (survivor === null) {
          setErrorMessage("No survivor found for your account.");
          return;
        }
        setSurvivorId(survivor.id);
      } catch (e) {
        console.error(e);
        setErrorMessage(e.message);
      }
    }

    loadActions();
    loadSurvivor();
  }, []);

  async function handlePerformAction(actionId) {
    if (survivorId === null) {
      setErrorMessage("No survivor found for your account.");
      return;
    }

    try {
      setErrorMessage(null);
      const result = await performAction(survivorId, actionId); 
      setEffectiveness(result.effectiveness);
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message);
    }
  }

  //TODO add survivors name)
  return (
    <>
    <div className="m-8">
      <h1 className="action-title">Perform an Action</h1>
      <h2 className="action-subtitle">Pick an action to see how well you'll do.</h2>
      {errorMessage && <p className="action-error">{errorMessage}</p>}
      <div className="flex flex-col md:flex-row">
          <ActionSelector actions={actions} selected={selectedAction} onActionClicked={setSelectedAction} onPerformClicked={handlePerformAction} canPerform={survivorId !== null} />
          <ActionResult effectiveness={effectiveness}/>
      </div>
    </div>
    </>
  );
}
