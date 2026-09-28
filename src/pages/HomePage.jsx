import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import keycloak from "../../keycloak";
import "../css/HomePage.css";




const menu_items = [
    {id: 'new', label: 'New Game', sub: 'Choose your survivor and begin', always: true },
    {id: 'continue', label: 'Continue Game', sub: null, always: false },
    {id: 'settings', label: 'Settings', sub: 'Difficulty, display, audio', always: true}
  ]


export default function HomePage({savedGame, onNavigate, onClick}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();

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

  useEffect(() => {
    setIsLoggedIn(!!keycloak.authenticated)
    }, [])

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
     
      <div className="text-center mb-16">
        <p className="blinking-title animate-pulse-red">ZOMBIE APOCALYPSE INCOMING</p>
        <h1 className="homepage-title animate-flicker">SURVIVOR</h1>
      </div>
      
        <nav className="flex flex-col gap-1 w-full max-w-xs">
            {isLoggedIn? (<>{menu_items.map(item => {
            const isDisabled = !item.always && !savedGame
            const subText = item.id === 'continue' && savedGame ? `${savedGame.classIcon}` : item.sub
        
            return(
                <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => handleMenuClick(item.id)}
                className={`group menu-button
                    ${isDisabled
                      ? 'menu-button-disabled'
                      : 'menu-button-active'}`} >
                <div className="flex items-center justify-between">
                    <div>
                      <p className={`button-label
                        ${isDisabled ? 'button-label-disabled' : 'button-label-active'}`}>
                            {item.label}
                        </p>
                        {subText && (
                            <p className="button-subtext">{subText}</p>
                        )}  
                    </div>
                    {!isDisabled && (
                        <span className="button-arrow">→</span>
                    )}
                </div> 
                    {!isDisabled && (
                        <div className="button-indicator" />
                    )}
                       

                </button>
            )
        
        })}
        
        <button className="mt-20 group menu-button menu-button-active w-full" onClick={logout}>Logout</button>
        </>):(
        <button className="group menu-button menu-button-active w-full" onClick={login}>Login</button>
        )}
        
        </nav>
    </div>
  );
}
