import keycloak from "../../keycloak";
import "../css/HomePage.css";
export default function HomePage() {
  function login() {
    keycloak.login();
  }

    function logout() {
    keycloak.logout();
  }
    function showToken() {
    console.log(keycloak.tokenParsed)
  }

  return (
    <div className="homepage-maincontent">
      <h1 className="homepage-title animate-flicker">ZOMBIE APOCALYPSE</h1>
      <button>New Game</button>
      <button>Load Game</button>
      <button>Settings</button>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={showToken}>Show Token</button>
    </div>
  );
}
