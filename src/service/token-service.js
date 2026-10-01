import keycloak from "../../keycloak";

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

export async function getAuthHeaders() {
  const jwt = await getToken();
  return getBearerHeader(jwt);
}

export function login() {
  keycloak.login();
}

export function logout() {
  keycloak.logout();
}
