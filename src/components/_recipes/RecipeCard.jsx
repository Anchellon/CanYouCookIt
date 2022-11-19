import React, { useState } from "react";
import PropTypes from "prop-types";

RecipeCard.propTypes = {
  recipe: PropTypes.object,
  setCurrentRecipe: PropTypes.func,
};

function RecipeCard(props) {
  const [isMouseOver, setMouseOver] = useState(false);

  function handleMouseOver() {
    setMouseOver(true);
  }

  function handleMouseOut() {
    setMouseOver(false);
  }

  return (
    <div
      className="card me-5 mb-5"
      style={{
        border: isMouseOver ? "1px solid red" : "1px solid lightgrey",
        width: "15rem",
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={() => props.setCurrentRecipe(props.recipe)}
    >
      <div className="card-body">
        <img
          src={props.recipe.image}
          alt={props.recipe.title}
          className="recipe-img mb-4"
        />
        <h5 className="card-title recipe-title">
          {props.recipe.title.length > 30
            ? props.recipe.title.substring(0, 30) + "..."
            : props.recipe.title}
        </h5>
      </div>
    </div>
  );
}

export default RecipeCard;
