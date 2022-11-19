import React, { useState, useEffect } from "react";
import Footer from "../Footer.jsx";
import Header from "../Header.jsx";
import Recipes from "./Recipes.jsx";
import CreateRecipe from "./CreateRecipe.jsx";

function MyRecipesPage() {
  //TODO change to realUserId when users implemented
  const userId = "637314759f3b63df03cb0055";

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/${userId}/myrecipes`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const recipesJson = await response.json();
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

  async function deleteFromMyRecipes(id) {
    console.log("will delete this recipe id", id);
    try {
      const response = await fetch(`/api/myrecipes/${id}`, {
        method: "delete",
      });
      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
        console.log("successfully deleted a recipe to myrecipes");
      } else {
        console.error(`Error in fetch delete method for /api/myrecipes/${id}`);
      }
    } catch (e) {
      console.log({ error: e });
    }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="d-flex align-content-start">
          <h1>My Recipes</h1>
          <CreateRecipe
            userId={userId}
            recipes={recipes}
            setRecipes={setRecipes}
          />
        </div>
        <Recipes
          recipes={recipes}
          onClick={deleteFromMyRecipes}
          setRecipes={setRecipes}
        />
      </div>
      <Footer />
    </div>
  );
}

export default MyRecipesPage;
