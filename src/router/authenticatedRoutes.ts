import { createBrowserRouter } from "react-router";

import HomePage from "../pages/HomePage.jsx";
import CreateSurvivorPage from "../pages/CreateSurvivorPage.jsx";

const authenticatedRoutes = [
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/create-survivor",
    Component: CreateSurvivorPage,
  },
];

export default authenticatedRoutes;
