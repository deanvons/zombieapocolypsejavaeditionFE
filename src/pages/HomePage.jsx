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
    console.log(keycloak.token);
  }

  function testToken() {
    fetch("http://localhost:8080/api/checkToken", {
      method: "GET", // or 'POST', 'PUT', etc.
      headers: {
        "Authorization": `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => console.log(response))
      .catch((response) => console.error(response));
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
      <button onClick={testToken}>Test Token</button>
    </div>
  );
}
