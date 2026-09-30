import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import keycloak, { initialize } from "../keycloak.js";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.js";
import { setUser } from "./redux/slices/user/userSlice.js";

const root = createRoot(document.getElementById("root"));

initialize()
    .then((authenticated) => {
        if (authenticated) {
            store.dispatch(
                setUser({
                    username: keycloak.tokenParsed?.preferred_username ?? null,
                }),
            );
        }

      //http://localhost:8080/api/profiles/all
      fetch(`http://localhost:8080/api/profiles/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          "Content-Type": "application/json",
        },
      }).then(response => console.log(response));
    

    root.render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>,
    );
  })
  .catch((err) => {
    console.error("Keycloak init failed:", err);

    root.render(
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <h2>Auth initialization failed</h2>
        <p>Check Keycloak config, realm URL, and client settings.</p>
      </div>,
    );
  });
