import { Outlet, useLocation } from "react-router";
import NavBar from "../components/NavBar";

const paths_without_navbar = ["/", "/create-survivor", "/settings"]

export default function AppLayout(){
    const location = useLocation()
    const showNavbar = !paths_without_navbar.includes(location.pathname)

    return(
        <>
        {showNavbar && <NavBar/>}
        <main>
            <Outlet/>
        </main>
        </>
    )
}