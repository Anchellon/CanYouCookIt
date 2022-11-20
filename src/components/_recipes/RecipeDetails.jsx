import React from "react";
import PropTypes from "prop-types";
import { getUnique, removeHtmlTags } from "../utils.js";
import RecipeIngredient from "./RecipeIngredient.jsx";
import RecipeDetailsElement from "./RecipeDetailsElement.jsx";

RecipeDetails.propTypes = {
  recipe: PropTypes.object,
  deleteFromMyRecipes: PropTypes.func,
  setRecipes: PropTypes.func,
};

function RecipeDetails(props) {
  return (
    props.recipe && (
      <div>
        <button
          className="btn btn-custom btn-red"
          style={{ float: "right" }}
          onClick={() => props.deleteFromMyRecipes(props.recipe.id)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        <RecipeDetailsElement
          recipe={props.recipe}
          setRecipes={props.setRecipes}
          isTitle={true}
        />
        <hr />
        <h3>Ingredients</h3>
        {/* Note: some ingredients returned from API call to Spoonacular return doubled
        --> need to filter with getUnique */}
        {props.recipe.extendedIngredients[0].original === ""
          ? "No ingredients provided"
          : getUnique(props.recipe.extendedIngredients, "id").map(
              (ingredient, idx) => (
                <RecipeDetailsElement
                  key={props.recipe.extendedIngredients[idx].id}
                  recipe={props.recipe}
                  idx={idx}
                  setRecipes={props.setRecipes}
                  isIngredient={true}
                />
              )
            )}
        <hr />
        <h3>Instructions</h3>
        <RecipeDetailsElement
          recipe={props.recipe}
          setRecipes={props.setRecipes}
          isInstructions={true}
        />
        {/* <p>
          {props.recipe.instructions === null ||
          props.recipe.instructions === ""
            ? "No instructions provided"
            : removeHtmlTags(props.recipe.instructions)}
        </p> */}
      </div>
    )
  );
}

export default RecipeDetails;
