import { createBrowserRouter } from "react-router";

import HomePage from "../pages/HomePage.jsx";
import CreateSurvivorPage from "../pages/CreateSurvivorPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/create-survivor",
    Component: CreateSurvivorPage,
  },

  /*Note: To add more pages, add import and an entry to the array:
  {
  path: "/example-page",
  Component: ExamplePage
  }
  */
]);

export default router;
