import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

export default function AppLayout(){
    return(
        <>
        <NavBar/>
        <main>
            <Outlet/>
        </main>
        </>
    )
}
