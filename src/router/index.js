import { createBrowserRouter } from "react-router";

import HomePage from "../pages/HomePage.jsx";
import SelectPage from "../pages/SelectPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/selectpage",
    Component: SelectPage,
  },
  {
    path: "/settings",
    Component: SettingsPage
  }

  /*Note: To add more pages, add import and an entry to the array: 
  {
  path: "/example-page",
  Component: ExamplePage
  }
  */
]);

export default router;
