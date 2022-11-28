import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OptionsList from "../components/ingredients/OptionsList.jsx";
import IngredientsTable from "../components/ingredients/IngredientsTable.jsx";

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
  const [checkedState, setCheckedState] = useState({});

  useEffect(() => {
    async function getMyIngredientsInventory() {
      try {
        const response = await fetch("/api/myinventory/");

        if (response.ok) {
          const ingredientsJson = await response.json();
          let dict;
          setIngredients(() => {
            dict = createChecksDictionary(ingredientsJson);
            return ingredientsJson;
          });
          setCheckedState(dict);
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

  const createChecksDictionary = (ingredientJson) => {
    let d = {};
    ingredientJson.forEach((element) => {
      d = {
        ...d,
        [element.name]: false,
      };
    });
    console.log("dictionary", d);
    return d;
  };

  const handleCheckedChange = (event) => {
    setCheckedState((prevFormData) => {
      let updatedObj = {
        ...prevFormData,
        [event.target.name]: event.target.checked,
      };

      return updatedObj;
    });
  };
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
      setCheckedState((prevData) => {
        let updatedData = {
          ...prevData,
        };
        delete updatedData[itemName];
        return updatedData;
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
  console.log("checkedState", checkedState);
  const handleSearchSubmit = async () => {
    let ingredientsForSearch = [];
    Object.entries(checkedState).forEach(([key, value]) => {
      if (value) {
        ingredientsForSearch.push(key);
      }
    });

    // console.log("ingredientsForSearch", ingredientsForSearch);
    props.setIngredientsForSearch({ ingredients: ingredientsForSearch });
    props.setShowSearch(true);
  };
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
            deleteItem={deleteItem}
            ingredients={ingredients}
            handleCheckedChange={handleCheckedChange}
            handleSearchSubmit={handleSearchSubmit}
            checkedState={checkedState}
          />
        </div>
      </div>
    </div>
  );
}
