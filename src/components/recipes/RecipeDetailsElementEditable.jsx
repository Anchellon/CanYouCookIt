import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

RecipeDetailsElement.propTypes = {
  title: PropTypes.string,
  instructions: PropTypes.string,
  ingredient: PropTypes.string,
  isTitle: PropTypes.bool,
  isIngredient: PropTypes.bool,
  isChanged: PropTypes.bool,
};

function RecipeDetailsElement(props) {
  const [toggle, setToggle] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [newText, setNewText] = useState("");
  const originalText = props.isTitle
    ? props.title
    : props.isIngredient
    ? props.ingredient
    : props.instructions;

  function handleChange(event) {
    setNewText(event.target.value);
  }

  return (
    <div>
      {toggle ? (
        props.isTitle ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Double-click to edit</Tooltip>}
          >
            <h3
              style={{ display: "inline" }}
              onDoubleClick={() => setToggle(false)}
            >
              {props.title}
            </h3>
          </OverlayTrigger>
        ) : props.isIngredient ? (
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Double-click to edit</Tooltip>}
          >
            <li onDoubleClick={() => setToggle(false)}>
              {/* {props.ingredient} */}
              {isChanged ? newText : originalText}
            </li>
          </OverlayTrigger>
        ) : (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Double-click to edit</Tooltip>}
          >
            <p onDoubleClick={() => setToggle(false)}>
              {/* {props.instructions} */}
              {isChanged ? newText : originalText}
            </p>
          </OverlayTrigger>
        )
      ) : (
        <Form>
          <Form.Control
            autoFocus
            as="textarea"
            rows={props.isTitle ? 1 : props.isIngredient ? 1 : 6}
            value={newText}
            onChange={handleChange}
            onKeyDown={(evt) => {
              if (evt.key === "Escape") {
                setToggle(true);
                evt.preventDefault();
                evt.stopPropagation();
              }
            }}
            // onMouseLeave={() => {
            //   setToggle(true);
            // }}
          />
          <Button
            onClick={() => {
              setNewText(newText);
              setToggle(true);
              setIsChanged(true);
            }}
            variant="btn btn-custom btn-green"
            type="submit"
            form="updateForm"
          >
            Update
          </Button>
        </Form>
      )}
    </div>
  );
}

export default RecipeDetailsElement;
