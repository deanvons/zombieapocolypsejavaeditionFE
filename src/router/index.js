import { createBrowserRouter } from "react-router";

import HomePage from "../pages/HomePage.jsx";


import SettingsPage from "../pages/SettingsPage.jsx";
import CreateSurvivorPage from "../pages/CreateSurvivorPage.jsx";
import CampPage from "../pages/CampPage.jsx";


const router = createBrowserRouter([
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
  },
  {
    path: "/camp",
    Component: CampPage
  }

  /*Note: To add more pages, add import and an entry to the array:
  {
  path: "/example-page",
  Component: ExamplePage
  }
  */
]);

export default router;
