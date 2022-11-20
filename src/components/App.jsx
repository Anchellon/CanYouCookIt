import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./homepage/HomePage.jsx";
import SearchRecipesPage from "./_recipes/SearchRecipesPage.jsx";
import MyRecipesPage from "./_recipes/MyRecipesPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/recipes" exact element={<SearchRecipesPage />} />
        <Route path="/myrecipes" exact element={<MyRecipesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
