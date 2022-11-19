import React from "react";
import PropTypes from "prop-types";
import { getUnique, removeHtmlTags } from "../utils.js";
import RecipeIngredient from "./RecipeIngredient.jsx";
import RecipeTitle from "./RecipeTitle.jsx";

RecipeDetails.propTypes = {
  recipe: PropTypes.object,
  onClick: PropTypes.func,
  setRecipes: PropTypes.func,
};

function RecipeDetails(props) {
  return (
    props.recipe && (
      <div>
        <button
          className="btn btn-custom btn-red"
          style={{ float: "right" }}
          onClick={() => props.onClick(props.recipe.id)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        {/* <h3>{props.recipe.title}</h3> */}
        <RecipeTitle
          recipe={props.recipe}
          setRecipes={props.setRecipes}
        />
        <hr />
        <h3>Ingredients</h3>
        {/* Note: some ingredients returned from API call to Spoonacular return doubled
        --> need to filter with getUnique */}
        {props.recipe.extendedIngredients[0].original === ""
          ? "No ingredients provided"
          : getUnique(props.recipe.extendedIngredients, "id").map(
              (ingredient) => (
                <RecipeIngredient
                  key={ingredient.id}
                  text={ingredient.original}
                />
              )
            )}
        <hr />
        <h3>Instructions</h3>
        <p>
          {props.recipe.instructions === null ||
          props.recipe.instructions === ""
            ? "No instructions provided"
            : removeHtmlTags(props.recipe.instructions)}
        </p>
      </div>
    )
  );
}

export default RecipeDetails;
