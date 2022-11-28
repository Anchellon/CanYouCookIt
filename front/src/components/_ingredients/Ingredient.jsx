import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Ingredient.css";

export default function Ingredient(props) {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    props.handleChecked(props.ingredient, checked);
  };

  return (
    <tr>
      <td>
        <img
          id={props.ingredient.id}
          src={props.ingredient.url}
          className="ingredient-img"
          alt={props.ingredient.url}
        />
      </td>
      <td>
        <div className="py-5 px-2">{props.ingredient.name}</div>
      </td>
      <td>
        <div className="py-5 px-4">
          <input
            type="checkbox"
            id="flexCheckDefault"
            name={props.ingredient.name}
            checked={checked}
            onChange={handleChange}
          />
        </div>
      </td>
      <td>
        <div className="py-5 px-3">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              props.handleClick(props.ingredient.id, props.ingredient.name);
            }}
          >
            X
          </button>
        </div>
      </td>
    </tr>
  );
}

Ingredient.propTypes = {
  handleClick: PropTypes.func,
  handleClick: PropTypes.func,
  ingredient: PropTypes.object,
};
