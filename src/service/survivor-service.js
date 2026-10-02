import { getAuthHeaders } from "./token-service";

const API_URL = import.meta.env.VITE_API_URL;

// GET /api/survivors
export async function getAllSurvivors() {
  const response = await fetch(`${API_URL}/api/survivors`, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    // Log the backend's { status, message } for debugging (the body may be empty, e.g. 401),
    // and give the player a friendly message
    const errorResponse = await response.json().catch(() => null);
    console.error(`getAllSurvivors failed (${response.status}):`, errorResponse?.message);
    throw new Error("Could not load the survivors. Please try again.");
  }

  return await response.json();
}

//GET/api/survivors/me
export async function getMySurvivor() {
  const response = await fetch(`${API_URL}/api/survivors/me`, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    console.error(`getMySurvivor failed (${response.status}):`, errorResponse?.message);
    throw new Error("Could not load your survivor. Please try again.");
  }

  return await response.json();
}

// POST /api/survivors
export async function createSurvivor(name, type) {
  const response = await fetch(`${API_URL}/api/survivors`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ name, type }),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    console.error(`createSurvivor failed (${response.status}):`, errorResponse?.message);
    // Players with a survivor are sent to /delete-survivor first, so a 409 here means the name is taken
    if (response.status === 409) {
      throw new Error("That name is already taken.");
    }
    throw new Error("Could not create your survivor. Please try again.");
  }

  return await response.json();
}

// DELETE /api/survivors/me
export async function deleteMySurvivor() {
  const response = await fetch(`${API_URL}/api/survivors/me`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    console.error(`deleteMySurvivor failed (${response.status}):`, errorResponse?.message);
    throw new Error("Could not delete your survivor. Please try again.");
  }
}

// POST /api/survivors/{id}/actions/{actionId}
export async function performAction(survivorId, actionId) {
  const response = await fetch(`${API_URL}/api/survivors/${survivorId}/actions/${actionId}`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    console.error(`performAction failed (${response.status}):`, errorResponse?.message);
    throw new Error("Could not perform the action. Please try again.");
  }

  return await response.json();
}

// POST /api/survivors/{id}/items
// item: { type: "tool" | "weapon", name, weight, durability?, damage? }
export async function loadItem(survivorId, item) {
  const response = await fetch(`${API_URL}/api/survivors/${survivorId}/items`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    throw new Error(errorResponse?.message ?? `loadItem failed: ${response.status}`);
  }

  // Returns the updated survivor
  return await response.json();
}

// DELETE /api/survivors/{id}/items/{itemId}
export async function deleteItem(survivorId, itemId) {
  const response = await fetch(`${API_URL}/api/survivors/${survivorId}/items/${itemId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    throw new Error(errorResponse?.message ?? `deleteItem failed: ${response.status}`);
  }
}
