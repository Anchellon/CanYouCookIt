import React, { useState, useEffect } from "react";
import Footer from "../Footer.jsx";
import Header from "../Header.jsx";
import Recipes from "./Recipes.jsx";

function SearchRecipesPage() {
  //TODO change to realUserId when users implemented
  const userId = "637314759f3b63df03cb0055";

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/recipes/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const recipesJson = await response.json();
          recipesJson.map((r) => (r.id = String(r.id)));
          setRecipes(recipesJson);

          console.log("on Load", recipesJson);
        } else {
          console.error("Error in fetch");
        }
      } catch (e) {
        console.log({ error: e });
      }
    }
    fetchData();
  }, []);


  return (
    <div>
      <Header />
      <div className="container">
        <h1>Search results:</h1>
        <Recipes recipes={recipes} setRecipes={setRecipes} userId={userId}/>
      </div>
      <Footer />
    </div>
  );
}

export default SearchRecipesPage;
