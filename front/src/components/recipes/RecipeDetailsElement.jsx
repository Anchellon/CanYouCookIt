import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { removeHtmlTags } from "../../utils/utils.js";
import "./RecipeDetailsElement.css";

RecipeDetailsElement.propTypes = {
  idx: PropTypes.number,
  recipe: PropTypes.object,
  setRecipes: PropTypes.func,
  isTitle: PropTypes.bool,
  isIngredient: PropTypes.bool,
  isInstructions: PropTypes.bool,
};

function RecipeDetailsElement(props) {
  const elementToUpdate = props.isTitle
    ? props.recipe.title
    : props.isIngredient
    ? props.recipe.extendedIngredients[props.idx].original ||
      "No ingredients provided"
    : props.recipe.instructions
    ? removeHtmlTags(props.recipe.instructions) || "No instructions provided"
    : null; // default

  const field = props.isTitle
    ? "title"
    : props.isIngredient
    ? `extendedIngredients[${props.idx}].original`
    : "instructions";

  const [toggle, setToggle] = useState(true);
  const [updatedRecipe, setUpdatedRecipe] = useState({ ...props.recipe });

  function handleChange(event) {
    const { name, value } = event.target;
    setUpdatedRecipe((prevRecipe) => {
      if (props.isIngredient) {
        const { extendedIngredients } = prevRecipe;
        extendedIngredients[props.idx].original = value;
        return { ...prevRecipe };
      } else {
        return { ...prevRecipe, [name]: value };
      }
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setToggle(true);
    props.setRecipes((prevRecipes) => {
      prevRecipes.map(
        (r) =>
          r.id === updatedRecipe.id &&
          (props.isTitle
            ? (r.title = updatedRecipe.title)
            : props.isIngredient
            ? (r.extendedIngredients = updatedRecipe.extendedIngredients)
            : (r.instructions = updatedRecipe.instructions))
      );
      // console.log([...prevRecipes]);
      return [...prevRecipes];
    });
    await updateRecipe(updatedRecipe);
  }

  async function updateRecipe(updatedRecipe) {
    console.log("will update this recipe id", updatedRecipe.id);
    try {
      const response = await fetch("/api/myrecipes/update", {
        method: "POST",
        body: JSON.stringify({ updatedRecipe: updatedRecipe }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        console.log("successfully updated a recipe in MyRecipes");
      } else {
        console.error("Error in fetch /api/myrecipes/update");
      }
    } catch (e) {
      console.log({ error: e });
    }
  }

  return toggle ? (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Double-click to edit</Tooltip>}
    >
      <p
        className={
          props.isTitle
            ? "title-details"
            : props.isIngredient
            ? "ingredient-details"
            : ""
        }
        onDoubleClick={() => setToggle(false)}
      >
        {elementToUpdate}
      </p>
    </OverlayTrigger>
  ) : (
    <div>
      <Form id="updateDetailsElement" onSubmit={handleSubmit}>
        <Form.Control
          autoFocus
          as="textarea"
          rows={props.isTitle ? 1 : props.isIngredient ? 1 : 6}
          value={
            props.isTitle
              ? updatedRecipe.title
              : props.isIngredient
              ? updatedRecipe.extendedIngredients[props.idx].original
              : updatedRecipe.instructions
          }
          onChange={handleChange}
          name={field}
          onKeyDown={(evt) => {
            if (evt.key === "Escape") {
              evt.preventDefault();
              setToggle(true);
            }
          }}
        />
        <Button
          variant="btn btn-custom btn-green"
          type="submit"
          form="updateDetailsElement"
        >
          Update
        </Button>
        <Button
          variant="btn btn-custom btn-red ms-2"
          type="button"
          onClick={(evt) => {
            evt.preventDefault();
            setUpdatedRecipe({ ...props.recipe });
            setToggle(true);
          }}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
}

export default RecipeDetailsElement;
