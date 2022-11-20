import React, { useState } from "react";
import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard.jsx";
import RecipeDetails from "./RecipeDetails.jsx";

Recipes.propTypes = {
  recipes: PropTypes.array,
  setRecipes: PropTypes.func,
};

function Recipes(props) {
  const [currentRecipe, setCurrentRecipe] = useState(props.recipes[0]);

  async function deleteFromMyRecipes(id) {
    console.log("will delete this recipe id", id);
    try {
      const response = await fetch(`/api/myrecipes/${id}`, {
        method: "delete",
      });
      if (response.ok) {
        props.setRecipes(props.recipes.filter((recipe) => recipe.id !== id));
        setCurrentRecipe(null);
        console.log("successfully deleted a recipe to myrecipes");
      } else {
        console.error(`Error in fetch delete method for /api/myrecipes/${id}`);
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
              />
            ))}
        </div>
      </div>
      <div className="col-6">
        <RecipeDetails
          key={currentRecipe && currentRecipe.id}
          setRecipes={props.setRecipes}
          deleteFromMyRecipes={deleteFromMyRecipes}
          recipe={currentRecipe}
        />
      </div>
    </div>
  );
}

export default Recipes;
