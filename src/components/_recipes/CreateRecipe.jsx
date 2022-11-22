//alternative version for adding inputFields for ingredients => not finished

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
  function handleClose() {
    setInputFields([{ ingredient: "" }]);
    setShow(false);
  }
  const handleShow = () => setShow(true);

  const [inputFields, setInputFields] = useState([{ ingredient: "" }]);

  function addInputField() {
    console.log("inside addInputField");
    setInputFields([
      ...inputFields,
      {
        ingredient: "",
      },
    ]);
  }

  function removeInputFields(idx) {
    const rows = [...inputFields];
    rows.splice(idx, 1);
    setInputFields(rows);
  }

  async function addNewToMyRecipes(newRecipe) {
    newRecipe.userId = props.userId;
    console.log("addNewToMyRecipes id", newRecipe.id);
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
    console.log("event", event);
    const eventData = [...event.target];
    const title = eventData.filter((formElem) => formElem.id === "title")[0]
      .value;
    const instructions = eventData.filter(
      (formElem) => formElem.id === "instructions"
    )[0].value;
    const image = eventData.filter((formElem) => formElem.id === "imageFile")[0]
      .value;
    const extendedIngredients = eventData
      .filter((formElem) => formElem.name === "ingredients")
      .map((ingrData) => {
        return { id: uuidv4(), original: ingrData.value };
      });

    const imageFile = image && image.files[0];
    const response = await handleFile(imageFile);
    const imageUrl = response ? response.fileUrl : "/images/new-recipe.png";

    const newRecipe = {
      id: uuidv4(),
      title: title,
      image: imageUrl,
      extendedIngredients: extendedIngredients,
      instructions:
        instructions === "" ? instructions.value : "No instructions provided",
    };
    handleClose();
    addNewToMyRecipes(newRecipe);
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
              <Form.Label>
                Title: <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                name="title"
                id="title"
                as="textarea"
                rows={1}
                autoFocus
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (optional):</Form.Label>
              <Form.Control
                type="file"
                accept=".png, .jpg, .jpeg"
                name="imageFile"
                id="imageFile"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ingredients:</Form.Label>
              {/* <Form.Control as="textarea" rows={1} /> */}
              {inputFields.map((data, idx) => {
                const { ingredient } = data;
                return (
                  <Form.Control
                    key={idx}
                    as="textarea"
                    rows={1}
                    name="ingredients"
                  />
                );
              })}
              <Button
                className="btn btn-custom btn-green"
                type="button"
                name="addInputField"
                onClick={addInputField}
              >
                <i className="bi bi-plus-lg"></i>
              </Button>
              <Button
                className="btn btn-custom btn-red"
                type="button"
                name="deleteInputField"
                onClick={removeInputFields}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructions:</Form.Label>
              <Form.Control as="textarea" rows={3} id="instructions" />
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
