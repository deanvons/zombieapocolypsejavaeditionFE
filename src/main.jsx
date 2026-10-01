import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import keycloak, { initialize } from "../keycloak.js";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.js";
import { setUser } from "./redux/slices/user/userSlice.js";
import { getExistingOrCreateUser } from "./service/user-service.js";

const root = createRoot(document.getElementById("root"));

initialize()
    .then(async (authenticated) => {
        if (authenticated) {
            const user = await getExistingOrCreateUser();
            store.dispatch(
                setUser({
                    user,
                }),
            );
        }

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
