import React from "react";
import PropTypes from "prop-types";
import { getUnique } from "../utils.js";
import RecipeDetailsElement from "./RecipeDetailsElement.jsx";

RecipeDetails.propTypes = {
  recipe: PropTypes.object,
  deleteOrAddAction: PropTypes.func,
  setRecipes: PropTypes.func,
  isMyRecipesPage: PropTypes.bool,
};

function RecipeDetails(props) {
  return (
    props.recipe && (
      <div>
        <button
          className="btn btn-custom btn-red"
          style={{ float: "right" }}
          onClick={() => props.deleteOrAddAction(props.recipe)}
        >
          {props.isMyRecipesPage ? (
            <i className="bi bi-trash3"></i>
          ) : (
            <i className="bi bi-plus-lg"></i>
          )}
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
        {getUnique(props.recipe.extendedIngredients, "id").map(
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
