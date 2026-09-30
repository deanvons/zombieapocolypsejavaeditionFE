import { keycloak } from "../../keycloak";

const API_URL = import.meta.env.VITE_API_URL;

async function updateAndGetToken() {
  return await keycloak.updateToken(30);
}

function getBearerHeader(jwt) {
  const headers = {
    Authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
  };

  return headers;
}

async function postNewUserProfile(jwt) {
  const response = await fetch(`${API_URL}/api/profiles/me`, {
    method: "POST",
    headers: getBearerHeader(jwt),
  });

  if (!response.ok) {
    throw new Error(`postNewUserProfile failed: ${response.status}`);
  }

  return await response.json();
}

async function getUserProfileForToken(jwt) {
  const response = await fetch(`${API_URL}/api/profiles/me`, {
    method: "GET",
    headers: getBearerHeader(jwt),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`getUserProfile failed: ${response.status}`);
  }

  return await response.json();
}

async function createUser() {
  const jwt = await updateAndGetToken();

  try {
    const user = await postNewUserProfile(jwt);
    return user;
  } catch (exception) {
    console.error(exception);
  }
}

async function getUserProfile() {
  const jwt = await updateAndGetToken();

  try {
    const user = await getUserProfileForToken(jwt);
    return user;
  } catch (exception) {
    console.error(exception);
  }
}

export async function getExistingOrCreateUser() {
  let user = await getUserProfile();

  if (user === null) {
    user = await createUser();
  }

  return user;
}
