import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import IndexPage from "./pages/IndexPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import MyRecipesPage from "./pages/MyRecipesPage.jsx";
import InventoryOrSearchPage from "./pages/InventoryOrSearchPage.jsx";  Very good design on pullinh each static pages for the website, I might need to replicate such design with project 4 to design and configure my project 3 

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/recipes",
    element: <MyRecipesPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/inventory",
    element: <InventoryOrSearchPage />,
    errorElement: <ErrorPage />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
