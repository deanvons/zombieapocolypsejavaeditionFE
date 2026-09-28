// init the connection

// expose an object to do keycloak stuff
import Keycloak from "keycloak-js";

const keycloak = new Keycloak("/assets/config/keycloak.json");

export const initialize = () => {
  const config = {
    checkLoginIframe: false,
    onLoad: "check-sso",
  };
  return keycloak.init(config);
};

export default keycloak;
