import { createBrowserRouter } from "react-router";

import HomePage from "../pages/HomePage.jsx";


const authenticatedRoutes = [
  {
    path: "/",
    Component: HomePage,
  },

  /*Note: To add more pages, add import and an entry to the array: 
  {
  path: "/example-page",
  Component: ExamplePage
  }
  */
];

export default authenticatedRoutes;
