import "../css/DeleteSurvivorPage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMySurvivor, deleteMySurvivor } from "../service/survivor-service.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";


export default function DeleteSurvivorPage() {
  const navigate = useNavigate();

  const [loadingSurvivorCheck, setLoadingSurvivorCheck] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Send the user home if they have no survivor to delete
  useEffect(() => {
    async function checkSurvivor() {
      try {
        const survivor = await getMySurvivor();
        if (survivor === null) {
          navigate("/", { replace: true });
          return;
        }
        setLoadingSurvivorCheck(false);
      } catch (e) {
        console.error(e);
        setErrorMessage(e.message);
        setLoadingSurvivorCheck(false);
      }
    }
    checkSurvivor();
  }, [navigate]);

  async function handleDelete() {
    try {
      setErrorMessage(null);
      await deleteMySurvivor();
      navigate("/create-survivor");
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  if (loadingSurvivorCheck) return <LoadingSpinner />;

  return (
    <div className="flex flex-col items-center justify-center px-8 py-16">
      <h1 className="delete-question">
        Are you sure you want to delete your survivor and start a new game?
      </h1>
      {errorMessage && <p className="delete-error">{errorMessage}</p>}

      <nav className="flex flex-col gap-1 w-full max-w-xs mt-10">
        <button className="group menu-button menu-button-active" type="button" onClick={handleDelete}>
          <p className="button-label button-label-active">Yes, delete.</p>
        </button>
        <button className="group menu-button delete-survivor-cancel-button" type="button" onClick={handleCancel}>
          <p className="button-label delete-survivor-cancel-label">No, take me back!</p>
        </button>
      </nav>
    </div>
  );
}
