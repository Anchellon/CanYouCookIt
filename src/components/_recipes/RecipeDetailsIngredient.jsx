import React from "react";
import PropTypes from "prop-types";

RecipeDetailsIngredient.propTypes = {
  text: PropTypes.string,
};

function RecipeDetailsIngredient(props) {
  return (
    <div>
      <p className="ingredient-details">{props.text}</p>
    </div>
  );
}

export default RecipeDetailsIngredient;
