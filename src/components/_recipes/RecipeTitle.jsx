import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

RecipeTitle.propTypes = {
  recipe: PropTypes.object,
  setRecipes: PropTypes.func,
};

function RecipeTitle(props) {
  const [toggle, setToggle] = useState(true);
  let newRecipe = { ...props.recipe };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setRecipe()
  };

  function handleChange(newTitle) {
    newRecipe.title = newTitle;
    props.setRecipes((prevRecipes) => {
      const oldRecipes = prevRecipes.filter(
        (recipe) => recipe.id !== newRecipe.id
      );
      return [...oldRecipes, newRecipe];
    });
  }

  return toggle ? (
    <h3 onDoubleClick={() => setToggle(false)}>{props.recipe.title}</h3>
  ) : (
    <Form onSubmit={handleSubmit} id="updateTitle">
      <Form.Control
        autoFocus
        as="textarea"
        rows={1}
        value={props.recipe.title}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
        onKeyDown={(evt) => {
          if (evt.key === "Escape") {
            setToggle(true);
            evt.preventDefault();
            evt.stopPropagation();
          }
        }}
      />
      <Button
        onClick={() => {
          setToggle(true);
        }}
        variant="btn btn-custom btn-green"
        type="submit"
        form="updateTitle"
      >
        Update
      </Button>
    </Form>
  );
}

export default RecipeTitle;
