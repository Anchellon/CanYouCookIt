import React from "react";
import PropTypes from "prop-types";

export default function OptionsList(props) {
  return (
    <ul id="possible-ingredients">
      {props.options.map((ingredient) => (
        <li
          key={ingredient.id}
          onClick={() => {
            props.setIngredient(ingredient);
            props.setFormData({ item: ingredient.name });
            props.setOptions([]);
            props.setBtnEnabled(true);
          }}
        >
          {ingredient.name}
        </li>
      ))}
    </ul>
  );
}
OptionsList.propTypes = {
  setIngredient: PropTypes.func,
  setFormData: PropTypes.func,
  setBtnEnabled: PropTypes.func,
  setOptions: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
};
