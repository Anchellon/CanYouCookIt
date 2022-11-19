import React from "react";
import PropTypes from "prop-types";

RecipeIngredient.propTypes = {
  text: PropTypes.string,
};

function RecipeIngredient(props) {
  return (
    <div>
      <li>{props.text}</li>
    </div>
  );
}

export default RecipeIngredient;
