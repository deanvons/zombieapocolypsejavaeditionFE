import { getAuthHeaders } from "./token-service";

const API_URL = import.meta.env.VITE_API_URL;

//GET /api/actions
export async function getAllActions() {
  const response = await fetch(`${API_URL}/api/actions`, {
    method: "GET",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const errorResponse = await response.json().catch(() => null);
    throw new Error(errorResponse?.message ?? `getAllActions failed: ${response.status}`);
  }

  return await response.json();
}