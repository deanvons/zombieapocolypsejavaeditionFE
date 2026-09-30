import keycloak from "../../keycloak";

const API_URL = import.meta.env.VITE_API_URL;

async function getToken() {
  await keycloak.updateToken(30);
  return keycloak.token;
}

function getBearerHeader(jwt) {
  return {
    Authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
  };
}

// GET /api/survivors
export async function getAllSurvivors() {
  const jwt = await getToken();
  const response = await fetch(`${API_URL}/api/survivors`, {
    method: "GET",
    headers: getBearerHeader(jwt),
  });

  if (!response.ok) {
    throw new Error(`getAllSurvivors failed: ${response.status}`);
  }

  return await response.json();
}

// POST /api/survivors 
export async function createSurvivor(name, type) {
  const jwt = await getToken();
  const response = await fetch(`${API_URL}/api/survivors`, {
    method: "POST",
    headers: getBearerHeader(jwt),
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
