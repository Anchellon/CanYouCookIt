import React from "react";
import PropTypes from "prop-types";
import Ingredient from "./Ingredient.jsx";

IngredientsTable.propTypes = {
  setShowSearch: PropTypes.func,
  setIngredientsForSearch: PropTypes.func,
  ingredients: PropTypes.array,
  setIngredients: PropTypes.func,
  deleteItem: PropTypes.func,
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
          {props.ingredients && props.ingredients.map((ingredient) => (
            <Ingredient
              key={ingredient.id}
              ingredient={ingredient}
              setIngredients={props.setIngredients}
              handleClick={props.deleteItem}
              handleChecked={props.handleChecked}
            />
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} className="btn btn-success">
        Find Recipes!
      </button>
    </form>
  );
}
