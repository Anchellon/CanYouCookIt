import React, { useState } from "react";
import BasePage from "./BasePage.jsx";
import SearchRecipesPage from "./SearchRecipesPage.jsx";
// import InventoryPage from "./InventoryPage.jsx";
import InventoryPage from "../components/_ingredients/InventoryPage.jsx";


export default function InventoryOrSearchPage() {
  const [showSearch, setShowSearch] = useState(false);
  const [ingredientsForSearch, setIngredientsForSearch] = useState([]);
  return (
    <BasePage>
      {showSearch ? (
        <SearchRecipesPage ingredientsForSearch={ingredientsForSearch} />
      ) : (
        <InventoryPage
          setShowSearch={setShowSearch}
          setIngredientsForSearch={setIngredientsForSearch}
        />
      )}
    </BasePage>
  );
}
