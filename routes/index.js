import express from "express";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import { removeHtmlTags } from "../front/src/utils/utils.js";
import mongo from "../db/mongoDB.js";
//TODO remove import of dummy recipes
// import dummy_recipes from "./dummy_recipes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const RECIPES_LIMIT = 5;

/* ------Katerina----- */

/* Middleware for mock authentication */
router.use("*", async function (req, res, next) {
  // Mock authentication before every request
  req.user = { userId: "637314759f3b63df03cb0055" };
  //637314759f3b63df03cb0056
  //637314759f3b63df03cb0055
  next();
});

router.get("/recipes", function (req, res) {
  res.send(304);
});

router.get("/inventory", function (req, res) {
  res.send(304);
});

/* POST recipes by ingredients */
router.post("/api/recipes/search", async function (req, res) {
  const ingredients = req.body.ingredients;
  // const ingredients = ["apples", "flour", "sugar"];

  console.log("ingredients", ingredients);

  if (ingredients) {
    const baseUrl = "https://api.spoonacular.com/recipes/findByIngredients";
    const ingredientsString = ingredients.join("%2C");

    const url = `${baseUrl}?apiKey=${process.env.API_KEY}&ingredients=${ingredientsString}&number=${RECIPES_LIMIT}&ignorePantry=true&ranking=1`;
    const options = { method: "GET" };

    try {
      // TODO: uncomment real request & remove dummy_recipes
      const recipiesResponse = await fetch(url, options);
      const recipes = await recipiesResponse.json();
      console.log("got recipes", recipes);
      // const recipes = dummy_recipes;

      if (recipes) {
        res.status(200).json(recipes);
      } else {
        res
          .status(404)
          .json({ err: "no matched results from Spoonacular API" });
      }
    } catch (e) {
      res.status(400).json({ err: e });
    }
  } else {
    res.status(404).json({ err: "No ingredients" });
  }
});

/* GET recipe by ID - either from external API (with write to Mongo) or from MongoDB */
router.get("/api/recipes/:id", async function (req, res) {
  const recipeId = req.params.id;

  console.log("got recipeId", recipeId);

  if (recipeId) {
    let recipeDetail;
    recipeDetail = await mongo.checkRecipe(recipeId);

    if (recipeDetail) {
      res.status(200).json(recipeDetail);
    } else {
      const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.API_KEY}`;
      const options = { method: "GET" };

      try {
        const detailResponse = await fetch(url, options);
        recipeDetail = await detailResponse.json();

        if (recipeDetail) {
          recipeDetail.instructions = recipeDetail.instructions
            ? removeHtmlTags(recipeDetail.instructions)
            : "No instructions provided";
          const detailResponse = await mongo.saveRecipe(recipeDetail);
          if (detailResponse.acknowledged) {
            res.status(200).json(recipeDetail);
          } else {
            console.log("couldn't write recipe to MongoDB");
          }
        } else {
          res
            .status(404)
            .json({ err: "no matched results from Spoonacular API" });
        }
      } catch (e) {
        res.status(400).json({ err: e });
      }
    }
  } else {
    res.status(404).json({ err: "No recipe ID" });
  }
});

router.post("/api/myrecipes/add", async function (req, res) {
  const recipe = req.body.newRecipe;
  const userId = req.user.userId;
  recipe.userId = userId;

  console.log("got recipe id", recipe.id);

  if (recipe) {
    let getRecipeResponse = await mongo.getRecipe(recipe.id, userId);
    console.log("getRecipeResponse", getRecipeResponse);
    if (getRecipeResponse === null) {
      const addRecipesResponse = await mongo.addRecipe(recipe);
      if (addRecipesResponse.acknowledged) {
        res.status(200).send({ msg: "recipe added successfully" });
      } else {
        console.log("couldn't save recipe to myrecipes in MongoDB");
      }
    } else {
      res.status(200).json({ msg: "recipe already added" });
    }
  } else {
    console.log("no recipe id was provided with this request");
  }
});

router.get("/api/myrecipes", async function (req, res) {
  const userId = req.user.userId;

  if (userId) {
    console.log("router: getting recipes...");
    const recipes = await mongo.getRecipes(userId);
    if (recipes) {
      res.status(200).json(recipes);
    } else {
      console.log("couldn't retrieve myrecipes for user from MongoDB");
    }
  } else {
    console.log("no userId was provided with this request");
  }
});

router.delete("/api/myrecipes/:id", async function (req, res) {
  const recipeId = req.params.id;
  const userId = req.user.userId;

  console.log("inside delete recipeId", recipeId);

  if (recipeId) {
    const recipe = await mongo.getRecipe(recipeId, userId);

    const isUserUpload =
      recipe.image.split("/images/userUpload/").length > 1 ? true : false;

    if (isUserUpload) {
      const imagePath = __dirname + "/../front/build" + recipe.image;
      console.log("imagePath", imagePath);
      fs.unlinkSync(imagePath);
    }
    const myRecipesRes = await mongo.deleteRecipe(recipeId, userId);

    if (myRecipesRes.acknowledged) {
      res.status(200).send();
    } else {
      console.log(
        "couldn't delete recipe to myrecipes or from recipes in MongoDB"
      );
    }
  } else {
    console.log("no recipe id was provided with this request");
  }
});

router.post("/api/myrecipes/new", async function (req, res) {
  const newRecipe = req.body.newRecipe;
  const userId = req.user.userId;
  newRecipe.userId = userId;

  if (newRecipe) {
    const newRecipeResponse = await mongo.createRecipe(newRecipe);
    if (newRecipeResponse.acknowledged) {
      res.status(200).send();
    } else {
      console.log("couldn't write recipe to MongoDB");
    }
  } else {
    res.status(404).json({ err: "no newRecipe was provided" });
  }
});

router.post("/api/myrecipes/upload", function (req, res) {
  // console.log("inside upload request", req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const sampleFile = req.files.imageFile;
  const imageName = `${uuidv4()}_${sampleFile.name}`;
  const uploadPath = `${__dirname}/../front/build/images/userUpload/${imageName}`;

  const uploadUrl = `/images/userUpload/${imageName}`;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.status(200).json({ fileUrl: uploadUrl });
  });
});

router.post("/api/myrecipes/update", async function (req, res) {
  const updatedRecipe = req.body.updatedRecipe;
  console.log("updatedRecipe", updatedRecipe);
  const userId = req.user.userId;

  console.log("got updatedRecipe", updatedRecipe);

  if (updatedRecipe) {
    const updatedRecipeResponse = await mongo.updateRecipe(
      updatedRecipe,
      userId
    );
    if (updatedRecipeResponse.acknowledged) {
      res.status(200).send();
    } else {
      console.log("couldn't update recipe in MongoDB");
    }
  } else {
    res.status(404).json({ err: "no updatedRecipe was provided" });
  }
});

/* ------Katerina end----- */

/* ------Anshul start----- */
router.get("/api/ingredients", async function (req, res) {
  const searchText = req.query.query;
  const retrievedIngredients = await mongo.getIngredients(searchText);
  let possibleIngredients = [];
  console.log(retrievedIngredients);
  retrievedIngredients.forEach((elt) => possibleIngredients.push(elt["name"]));
  res.status(200).json(retrievedIngredients);
});

router.get("/api/myinventory/", async function (req, res) {
  const userId = req.user.userId;
  const retrievedInventory = await mongo.getInventory(userId);
  res.status(200).json(retrievedInventory);
});

router.post("/api/myinventory/add", async (req, res) => {
  const userId = req.user.userId;
  let ingredient = req.body.ingredient;
  ingredient.userId = userId;
  console.log("will add item with id", ingredient);
  const status = await mongo.addToInventory(ingredient);
  console.log("status", status);
  res.status(200).json({ requestBody: status });
});

router.delete("/api/myinventory/delete/:itemId", async (req, res) => {
  const userId = req.user.userId;
  const itemId = req.params.itemId;
  const status = await mongo.deleteItem(userId, itemId);
  res.status(200).json(status);
});
/* ------Anshul end----- */

export default router;
