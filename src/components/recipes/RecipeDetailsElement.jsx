import React from "react";
import PropTypes from "prop-types";

RecipeDetailsElement.propTypes = {
  title: PropTypes.string,
  instructions: PropTypes.string,
  ingredient: PropTypes.string,
  isTitle: PropTypes.bool,
  isIngredient: PropTypes.bool,
};

function RecipeDetailsElement(props) {
  return (
    <div>
      {props.isTitle ? (
        <h3 style={{ display: "inline" }}>{props.title}</h3>
      ) : props.isIngredient ? (
        <li>{props.ingredient}</li>
      ) : (
        <p>{props.instructions}</p>
      )}
    </div>
  );
}

export default RecipeDetailsElement;
