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
  const [updatedRecipe, setUpdatedRecipe] = useState({ ...props.recipe });

  function handleChange(event) {
    const { name, value } = event.target;
    setUpdatedRecipe((prevRecipe) => {
      return { ...prevRecipe, [name]: value };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setToggle(true);
    props.setRecipes((prevRecipes) => {
      prevRecipes.map(
        (r) => r.id === updatedRecipe.id && (r.title = updatedRecipe.title)
      );
      console.log([...prevRecipes]);
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
    <h3 onDoubleClick={() => setToggle(false)}>{props.recipe.title}</h3>
  ) : (
    <div>
      <Form id="updateTitle" onSubmit={handleSubmit}>
        <Form.Control
          autoFocus
          as="textarea"
          rows={1}
          value={updatedRecipe.title}
          onChange={handleChange}
          name="title"
          onKeyDown={(evt) => {
            if (evt.key === "Escape") {
              setToggle(true);
              evt.preventDefault();
              evt.stopPropagation();
            }
          }}
        />
        <Button
          variant="btn btn-custom btn-green"
          type="submit"
          form="updateTitle"
        >
          Update
        </Button>
        <Button
          variant="btn btn-custom btn-red"
          type="button"
          onClick={(evt) => {
            setToggle(true);
            evt.preventDefault();
          }}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
}

export default RecipeTitle;
