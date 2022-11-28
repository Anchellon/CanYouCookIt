import React from "react";
import PropTypes from "prop-types";
import Ingredient from "./Ingredient.jsx";

IngredientsTable.propTypes = {
  ingredients: PropTypes.array,
  deleteItem: PropTypes.func,
  handleCheckedChange: PropTypes.func,
  handleSearchSubmit: PropTypes.func,
};

export default function IngredientsTable(props) {
  return (
    <form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="col-1" scope="col"></th>
            <th className="col-6" scope="col-6">
              Ingredient
            </th>
            <th className="col-1" scope="col">
              Add Item to search
            </th>
            <th className="col-1" scope="col">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {props.ingredients &&
            props.ingredients.map((ingredient) => (
              <Ingredient
                key={ingredient.id}
                ingredient={ingredient}
                handleClick={props.deleteItem}
                handleCheckedChange={props.handleCheckedChange}
              />
            ))}
        </tbody>
      </table>
      <button onClick={props.handleSearchSubmit} className="btn btn-success">
        Find Recipes!
      </button>
    </form>
  );
}
