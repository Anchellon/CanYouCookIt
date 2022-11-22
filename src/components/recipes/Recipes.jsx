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
  const [isAdding, setIsAdding] = useState(false);

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

  async function addSearchedToMyRecipes(newRecipe) {
    setIsAdding(true);

    newRecipe.userId = props.userId;
    console.log("addSearchedToMyRecipes id", newRecipe.id);
    try {
      const response = await fetch("/api/myrecipes/add", {
        method: "POST",
        body: JSON.stringify({ newRecipe: newRecipe }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setTimeout(() => {
          setIsAdding(false);
        }, 500);
        console.log(await response.json());
      } else {
        console.error("Error in fetch /api/myrecipes/add");
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
            .sort((r1, r2) =>
              props.isMyRecipesPage
                ? r1.timestamp - r2.timestamp
                : r1.title.localeCompare(r2.title)
            )
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
            props.isMyRecipesPage ? deleteFromMyRecipes : addSearchedToMyRecipes
          }
          recipe={currentRecipe}
          isMyRecipesPage={props.isMyRecipesPage}
          isAdding={isAdding}
        />
      </div>
    </div>
  );
}

export default Recipes;
