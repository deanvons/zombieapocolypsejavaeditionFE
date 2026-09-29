import { createBrowserRouter } from "react-router";

import HomePage from "../pages/HomePage.jsx";
import CreateSurvivorPage from "../pages/CreateSurvivorPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";

const authenticatedRoutes = [
    {
        path: "/",
        Component: HomePage,
    },
    {
        path: "/create-survivor",
        Component: CreateSurvivorPage,
    },
    {
        path: "/settings",
        Component: SettingsPage
    }
];

export default authenticatedRoutes;
