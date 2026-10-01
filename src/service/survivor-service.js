import { getAuthHeaders } from "./token-service";

const API_URL = import.meta.env.VITE_API_URL;

// GET /api/survivors
export async function getAllSurvivors() {
  const response = await fetch(`${API_URL}/api/survivors`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`getAllSurvivors failed: ${response.status}`);
  }

  return await response.json();
}

//GET/api/survivors/me
export async function getMySurvivor() {
  const response = await fetch(`${API_URL}/api/survivors/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`getMySurvivor failed: ${response.status}`);
  }

  return await response.json();
}

// POST /api/survivors
export async function createSurvivor(name, type) {
  const response = await fetch(`${API_URL}/api/survivors`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, type }),
  });

  if (response.status === 409) {
    throw new Error("You already have a survivor.");
  }

  if (!response.ok) {
    throw new Error(`createSurvivor failed: ${response.status}`);
  }

  return await response.json();
}

export async function deleteMySurvivor() {
  const response = await fetch(`${API_URL}/api/survivors/me`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (response.status === 404) {
    throw new Error("You don't have a survivor to delete.");
  }

  if (!response.ok) {
    throw new Error(`deleteMySurvivor failed: ${response.status}`);
  }
}
