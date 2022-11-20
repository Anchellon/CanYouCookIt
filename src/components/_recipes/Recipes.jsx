import React, { useState } from "react";
import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard.jsx";
import RecipeDetails from "./RecipeDetails.jsx";

Recipes.propTypes = {
  userId: PropTypes.string,
  recipes: PropTypes.array,
  setRecipes: PropTypes.func,
  isMyRecipesPage: PropTypes.bool,
};

function Recipes(props) {
  const [currentRecipe, setCurrentRecipe] = useState(props.recipes[0]);

  async function deleteFromMyRecipes(recipe) {
    console.log("will delete this recipe id", recipe.id);
    try {
      const response = await fetch(`/api/myrecipes/${recipe.id}`, {
        method: "delete",
      });
      if (response.ok) {
        props.setRecipes(props.recipes.filter((r) => r.id !== recipe.id));
        setCurrentRecipe(null);
        console.log("successfully deleted a recipe to myrecipes");
      } else {
        console.error(
          `Error in fetch delete method for /api/myrecipes/${recipe.id}`
        );
      }
    } catch (e) {
      console.log({ error: e });
    }
  }

  async function addToMyRecipes(newRecipe) {
    newRecipe.userId = props.userId;
    console.log("addToMyRecipes id", newRecipe.id);
    try {
      const response = await fetch("/api/myrecipes/new", {
        method: "POST",
        body: JSON.stringify({ newRecipe: newRecipe }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        console.log("successfully added a recipe to MyRecipes");
      } else {
        console.error("Error in fetch /api/myrecipes/new");
      }
    } catch (e) {
      console.log({ error: e });
    }
  }

  async function showRecipeDetails(id) {
    console.log("showRecipeDetails", id);
    try {
      const response = await fetch(`/api/recipes/${id}`);
      if (response.ok) {
        const detailJson = await response.json();
        setCurrentRecipe(detailJson);
      } else {
        console.error(`Error in fetch /api/recipes/${id}`);
      }
    } catch (e) {
      console.log({ error: e });
    }
  }

  return (
    <div className="row">
      <div className="col-6">
        <div className="row">
          {props.recipes
            .sort((r1, r2) => r1.id.localeCompare(r2.id))
            .map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                setCurrentRecipe={setCurrentRecipe}
                showRecipeDetails={showRecipeDetails}
                isMyRecipesPage={props.isMyRecipesPage}
              />
            ))}
        </div>
      </div>
      <div className="col-6">
        <RecipeDetails
          key={currentRecipe && currentRecipe.id}
          setRecipes={props.setRecipes}
          deleteOrAddAction={
            props.isMyRecipesPage ? deleteFromMyRecipes : addToMyRecipes
          }
          recipe={currentRecipe}
          isMyRecipesPage={props.isMyRecipesPage}
        />
      </div>
    </div>
  );
}

export default Recipes;
