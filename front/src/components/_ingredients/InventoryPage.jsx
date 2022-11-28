import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OptionsList from "../_ingredients/OptionsList.jsx";
import IngredientsTable from "../_ingredients/IngredientsTable.jsx";

InventoryPage.propTypes = {
  setShowSearch: PropTypes.func,
  setIngredientsForSearch: PropTypes.func,
};

export default function InventoryPage(props) {
  const [formData, setFormData] = useState({
    item: "",
  });
  const [options, setOptions] = useState([]);
  const [ingredient, setIngredient] = useState({});
  const [btnEnabled, setBtnEnabled] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [searchIngredients, setSearchIngredients] = useState([]);

  useEffect(() => {
    async function getMyIngredientsInventory() {
      try {
        const response = await fetch("/api/myinventory/");

        if (response.ok) {
          const ingredientsJson = await response.json();
          ingredientsJson.map((ingr) => (ingr.checkedState = false));
          console.log("ingredientsJson", ingredientsJson);
          setIngredients(ingredientsJson);
        } else {
          console.error("Error in fetch api/myinventory/");
        }
      } catch (e) {
        console.log({ error: e });
      }
    }
    getMyIngredientsInventory();
  }, []);

  const deleteItem = async (itemId, itemName) => {
    await fetch("api/myinventory/delete/" + itemId, {
      method: "DELETE",
    }).then(() => {
      setIngredients((prevList) => {
        let updatedList = prevList.filter(
          (ingredient) => ingredient.id !== itemId
        );
        return updatedList;
      });
    });
  };

  async function handleChange(event) {
    setFormData((prevFormData) => {
      let updatedObj = {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
      return updatedObj;
    });

    if (event.target.value.length > 2) {
      let res = await fetch(
        "/api/ingredients?" +
          new URLSearchParams({
            query: event.target.value,
          })
      );
      const items = await res.json();
      console.log("found ingredients", items);
      setOptions(items);
    }
  }

  async function addItem(ingredient) {
    console.log("adding ingredient", ingredient);
    // post
    const responseAddItem = await fetch("/api/myinventory/add", {
      method: "POST",
      body: JSON.stringify({ ingredient: ingredient }),
      headers: { "Content-Type": "application/json" },
    });
    if (responseAddItem.ok) {
      console.log("successfully added item to Inventory collection");
    } else {
      console.error("Error in fetch /api/myinventory/add");
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    await addItem(ingredient);
    setIngredients((prevIngred) => [...prevIngred, ingredient]);
    setFormData({
      item: "",
    });
    setBtnEnabled(false);
  }

  function handleChecked(ingredient, checked) {
    ingredient.checkedState = !checked;
    if (checked){
        setSearchIngredients((prevIngred) => [...prevIngred, ingredient.name]);
    }
    console.log("searchIngredients", searchIngredients);
  }

  return (
    <div className="container">
      <h1>Inventory</h1>
      <div>
        <h2 className="mb-4">Add Ingredient</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6">
              <input
                className="form-control"
                list="possible-ingredients"
                name="item"
                id="item"
                onChange={handleChange}
                value={formData.item}
                required
                placeholder="Enter ingredient"
              />
              <OptionsList
                setIngredient={setIngredient}
                setFormData={setFormData}
                setOptions={setOptions}
                setBtnEnabled={setBtnEnabled}
                options={options}
              />
            </div>
            <div className="col-2">
              <button
                type="submit"
                disabled={!btnEnabled}
                className="btn btn-primary"
              >
                +Add
              </button>
            </div>
          </div>
        </form>
        <div>
          <h2>My Ingredients</h2>
          <IngredientsTable
            setShowSearch={props.setShowSearch}
            setIngredientsForSearch={props.setIngredientsForSearch}
            deleteItem={deleteItem}
            ingredients={ingredients}
            setIngredients={setIngredients}
            handleChecked={handleChecked}
          />
        </div>
      </div>
    </div>
  );
}
