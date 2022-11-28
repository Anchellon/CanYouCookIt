import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Ingredients from "./Ingredients.jsx";

IngredientsTable.propTypes = {
  setShowSearch: PropTypes.func,
  setIngredientsForSearch: PropTypes.func,
};

export default function IngredientsTable(props) {
  // fetch all ingredients and then display

  const [ingredientsInfo, setIngredientsInfo] = useState();

  useEffect(() => {
    async function getMyIngredientsInventory(id) {
      try {
        const response = await fetch("/api/myinventory/" + id);

        if (response.ok) {
          const ingredientsJson = await response.json();
          let dict;
          setIngredientsInfo(() => {
            dict = createChecksDictionary(ingredientsJson);

            // console.log(dict);
            return ingredientsJson;
          });
          setCheckedState(dict);
        } else {
          console.error("Error in fetch api/myinventory/<id>");
        }
      } catch (e) {
        console.log({ error: e });
      }
    }
    getMyIngredientsInventory(1);
  }, []);

  const deleteItem = async (userId, itemId, itemName) => {
    await fetch("api/myinventory/" + userId + "/" + itemId, {
      method: "DELETE",
    }).then(() => {
      setIngredientsInfo((prevList) => {
        let updatedList = prevList.filter(
          (ingredient) => ingredient.id !== itemId
        );
        return updatedList;
      });
      setCheckedState((prevData) => {
        let updatedData = {
          ...prevData,
        };
        delete updatedData[itemName];
        return updatedData;
      });
    });
  };
  const createChecksDictionary = (ingredientJson) => {
    let d = {};
    ingredientJson.forEach((element) => {
      d = {
        ...d,
        [element.name]: false,
      };
    });
    return d;
  };

  const [checkedState, setCheckedState] = useState({});

  const handleOnChange = (event) => {
    setCheckedState((prevFormData) => {
      let updatedObj = {
        ...prevFormData,
        [event.target.name]: event.target.checked,
      };

      return updatedObj;
    });
  };
  // const logger = () => {
  //   console.log(checkedState);
  // };
  const handleSubmit = async () => {
    let ingredientsForSearch = [];
    Object.entries(checkedState).forEach(([key, value]) => {
      if (value) {
        ingredientsForSearch.push(key);
      }
    });

    console.log("ingredientsForSearch", ingredientsForSearch.toString());
    props.setIngredientsForSearch({ ingredients: ingredientsForSearch });
    props.setShowSearch(true);
  };

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
          {ingredientsInfo && (
            <Ingredients
              ingredients={ingredientsInfo}
              handleClick={deleteItem}
              handleOnChange={handleOnChange}
              checkedData={checkedState}
            ></Ingredients>
          )}
        </tbody>
      </table>
      <span onClick={handleSubmit} className="btn btn-success">
        Find Recipes!
      </span>
    </form>
  );
}