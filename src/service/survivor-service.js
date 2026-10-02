import { getAuthHeaders } from "./token-service";

const API_URL = import.meta.env.VITE_API_URL;

// GET /api/survivors
export async function getAllSurvivors() {
  const response = await fetch(`${API_URL}/api/survivors`, {
    method: "GET",
    headers: await getAuthHeaders(),
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
    headers: await getAuthHeaders(),
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
    headers: await getAuthHeaders(),
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
    headers: await getAuthHeaders(),
  });

  if (response.status === 404) {
    throw new Error("You don't have a survivor to delete.");
  }

  if (!response.ok) {
    throw new Error(`deleteMySurvivor failed: ${response.status}`);
  }
}

// POST /api/survivors/{id}/actions/{actionId}
export async function performAction(survivorId, actionId) {
  const response = await fetch(`${API_URL}/api/survivors/${survivorId}/actions/${actionId}`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    // The backend sends { status, message } on errors; However, the body may be empty (e.g. 401)
    const errorResponse = await response.json().catch(() => null);
    throw new Error(errorResponse?.message ?? `performAction failed: ${response.status}`);
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
