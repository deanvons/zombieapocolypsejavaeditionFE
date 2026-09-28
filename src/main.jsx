import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initialize } from '../keycloak.js'

const root = createRoot(document.getElementById('root'))


initialize()
  .then(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch((err) => {
    console.error("Keycloak init failed:", err);

    root.render(
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <h2>Auth initialization failed</h2>
        <p>Check Keycloak config, realm URL, and client settings.</p>
      </div>
    );
  });