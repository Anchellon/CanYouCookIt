import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

CreateRecipe.propTypes = {
  userId: PropTypes.string,
  recipes: PropTypes.array,
  setRecipes: PropTypes.func,
};

function CreateRecipe(props) {
  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function addToMyRecipes(newRecipe) {
    newRecipe.userId = props.userId;
    console.log("addToMyRecipes id", newRecipe.id);
    try {
      const response = await fetch("/api/myrecipes/new", {
        method: "POST",
        body: JSON.stringify({ newRecipe: newRecipe }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        console.log("successfully added a recipe to MyRecipes");
      } else {
        console.error("Error in fetch /api/myrecipes/new");
      }
    } catch (e) {
      console.log({ error: e });
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const [title, image, ingredients, instructions, id] = event.target;
    const inredientId = uuidv4();
    const imageFile = image.files[0];
    const response = await handleFile(imageFile);
    const imageUrl = response ? response.fileUrl : "/images/new-recipe.png";

    const newRecipe = {
      id: id.name,
      title: title.value,
      image: imageUrl,
      extendedIngredients: [{ id: inredientId, original: ingredients.value }],
      instructions:
        instructions === "" ? instructions.value : "No instructions provided",
    };
    handleClose();
    addToMyRecipes(newRecipe);
    props.setRecipes([...props.recipes, newRecipe]);
  };

  async function handleFile(file) {
    const formData = new FormData();
    formData.append("imageFile", file);

    if (!file) {
      return;
    }

    console.log(file);
    try {
      const response = await fetch("/api/myrecipes/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("successfully uploaded an image");
        const result = await response.json();

        return result;
      } else {
        console.error("Error in fetch api/myrecipes/upload");
      }
    } catch (e) {
      console.log({ error: e });
    }
  }

  return (
    <>
      <Button variant="btn btn-create ms-5" onClick={handleShow}>
        {<i className="bi bi-plus-lg"></i>}
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} id="recipeForm">
            <Form.Group className="mb-3">
              <Form.Label>Title:</Form.Label>
              <Form.Control as="textarea" rows={1} autoFocus required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (optional):</Form.Label>
              <Form.Control
                type="file"
                accept=".png, .jpg, .jpeg"
                name="imageFile"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ingredients:</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructions:</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="btn btn-custom btn-green"
            type="submit"
            form="recipeForm"
            name={uuidv4()}
          >
            Save
          </Button>
          <Button
            variant="btn btn-custom btn-red"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateRecipe;
