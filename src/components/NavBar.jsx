import { useNavigate } from "react-router";
import "../css/Navbar.css";

export default function NavBar(){
    const navigate = useNavigate()
     
    return (
    <nav className="navbar">
    <button 
    onClick={() => navigate("/")}
          className="navbar-button">Home</button>
    <button
    onClick={() => navigate("/settings")} //temporary navigation
          className="navbar-button">My profile</button>
    <button
    onClick={() => navigate("/camp")}
          className="navbar-button">Camp</button>
    <button
    onClick={() => navigate("/actions")}
          className="navbar-button">Actions</button>
   
    </nav>
    )
}

