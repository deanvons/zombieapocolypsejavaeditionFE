import { getAuthHeaders } from "./token-service";

const API_URL = import.meta.env.VITE_API_URL;

async function postNewUserProfile() {
  const response = await fetch(`${API_URL}/api/profiles/me`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`postNewUserProfile failed: ${response.status}`);
  }

  return await response.json();
}

async function getUserProfileForToken() {
  const response = await fetch(`${API_URL}/api/profiles/me`, {
    method: "GET",
    headers: await getAuthHeaders(),
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
  try {
    const user = await postNewUserProfile();
    return user;
  } catch (exception) {
    console.error(exception);
  }
}

async function getUserProfile() {
  try {
    const user = await getUserProfileForToken();
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
