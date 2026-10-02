import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import AmbientMusic from "../components/AmbientMusic.jsx";

export default function AppLayout(){
    return(
        <>
        {/* This is vibe coded: keep music alive while home and settings swap routes. */}
        <AmbientMusic />
        <NavBar/>
        <main>
            <Outlet/>
        </main>
        </>
    )
}
