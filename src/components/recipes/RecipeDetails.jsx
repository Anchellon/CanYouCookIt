import React from "react";
import PropTypes from "prop-types";
import { getUnique } from "../utils.js";
import RecipeDetailsElement from "./RecipeDetailsElement.jsx";
import RecipeDetailsIngredient from "./RecipeDetailsIngredient.jsx";

RecipeDetails.propTypes = {
  recipe: PropTypes.object,
  deleteOrAddAction: PropTypes.func,
  setRecipes: PropTypes.func,
  isMyRecipesPage: PropTypes.bool,
  isAdding: PropTypes.bool,
};

function RecipeDetails(props) {
  return (
    props.recipe && (
      <div>
        <button
          className={
            props.isMyRecipesPage
              ? "btn btn-custom btn-red"
              : "btn btn-custom btn-green"
          }
          style={{ float: "right" }}
          onClick={() => props.deleteOrAddAction(props.recipe)}
        >
          {props.isMyRecipesPage ? (
            <i className="bi bi-trash3"></i>
          ) : props.isAdding ? (
            <i className="bi bi-cloud-arrow-down"></i>
          ) : (
            <i className="bi bi-plus-lg"></i>
          )}
        </button>
        {props.isMyRecipesPage ? (
          <RecipeDetailsElement
            recipe={props.recipe}
            setRecipes={props.setRecipes}
            isTitle={true}
          />
        ) : (
          <h3>{props.recipe.title}</h3>
        )}
        <hr />
        <h3>Ingredients</h3>
        {/* Note: some ingredients returned from API call to Spoonacular return doubled
        --> need to filter with getUnique */}
        {getUnique(props.recipe.extendedIngredients, "id").map((ingr, idx) =>
          props.isMyRecipesPage ? (
            <RecipeDetailsElement
              key={props.recipe.extendedIngredients[idx].id}
              recipe={props.recipe}
              idx={idx}
              setRecipes={props.setRecipes}
              isIngredient={true}
            />
          ) : (
            <RecipeDetailsIngredient key={ingr.id} text={ingr.original} />
          )
        )}
        <hr />
        <h3>Instructions</h3>
        {props.isMyRecipesPage ? (
          <RecipeDetailsElement
            recipe={props.recipe}
            setRecipes={props.setRecipes}
            isInstructions={true}
          />
        ) : (
          <p>{props.recipe.instructions}</p>
        )}
      </div>
    )
  );
}

export default RecipeDetails;
