import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard.jsx";
import RecipeDetails from "./RecipeDetails.jsx";

Recipes.propTypes = {
  recipes: PropTypes.array,
  onClick: PropTypes.func,
  setRecipes: PropTypes.func,
};

function Recipes(props) {
    const [currentRecipe, setCurrentRecipe] = useState(props.recipes[0]);

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
          onClick={props.onClick}
          recipe={currentRecipe}
        />
      </div>
    </div>
  );
}

export default Recipes;
