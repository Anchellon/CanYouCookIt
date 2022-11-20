import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

function MongoModule() {
  const db = {};
  const url = process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/";
  const DB_NAME = "CanYouCookIt";
  const COLLECTION_RECIPES = "recipes";
  const COLLECTION_MYRECIPES = "myrecipes";

  const MONGO_DEFAULTS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  };

  /* ------Katerina----- */
  async function getRecipe(id) {
    let client;

    try {
      client = new MongoClient(url, MONGO_DEFAULTS);
      await client.connect();
      console.log("Connected to Mongo Server");

      const mongo = client.db(DB_NAME);
      const myRecipesCollection = mongo.collection(COLLECTION_MYRECIPES);

      const query = { id: id };
      const recipe = await myRecipesCollection.findOne(query);
      // console.log("inside getRecipe got recipe", recipe);
      return recipe;
    } finally {
      await client.close();
    }
  }

  async function checkRecipe(id) {
    let client;

    try {
      client = new MongoClient(url, MONGO_DEFAULTS);
      await client.connect();
      console.log("Connected to Mongo Server");

      const mongo = client.db(DB_NAME);
      const recipesCollection = mongo.collection(COLLECTION_RECIPES);

      const query = { id: id };
      const recipe = await recipesCollection.findOne(query);
      return recipe;
    } finally {
      await client.close();
    }
  }

  async function createRecipe(recipe) {
    // console.log("got recipe", recipe);
    recipe.id = String(recipe.id);
    recipe.timestamp = Date.now();

    let client;

    try {
      client = new MongoClient(url, MONGO_DEFAULTS);
      await client.connect();
      console.log("Connected to Mongo Server");

      const mongo = client.db(DB_NAME);
      const myRecipesCollection = mongo.collection(COLLECTION_MYRECIPES);

      const result = await myRecipesCollection.insertOne(recipe);
      return result;
    } finally {
      await client.close();
    }
  }

  async function saveRecipe(recipe) {
    // console.log("got recipe", recipe);
    recipe.id = String(recipe.id);

    let client;

    try {
      client = new MongoClient(url, MONGO_DEFAULTS);
      await client.connect();
      console.log("Connected to Mongo Server");

      const mongo = client.db(DB_NAME);
      const recipesCollection = mongo.collection(COLLECTION_RECIPES);

      const result = await recipesCollection.insertOne(recipe);
      return result;
    } finally {
      await client.close();
    }
  }

  async function addRecipe(recipe) {
    recipe.timestamp = Date.now();
    let client;

    try {
      client = new MongoClient(url, MONGO_DEFAULTS);
      await client.connect();
      console.log("Connected to Mongo Server");

      const mongo = client.db(DB_NAME);
      const myRecipesCollection = mongo.collection(COLLECTION_MYRECIPES);

      const result = await myRecipesCollection.insertOne(recipe);
      return result;
    } finally {
      await client.close();
    }
  }

  async function getRecipes(userId) {
    console.log("got userId", userId);
    let client;

    try {
      client = new MongoClient(url, MONGO_DEFAULTS);
      await client.connect();
      console.log("Connected to Mongo Server");

      const mongo = client.db(DB_NAME);
      const myRecipesCollection = mongo.collection(COLLECTION_MYRECIPES);

      const query = { userId: userId };
      const recipes = await myRecipesCollection.find(query).toArray();

      return recipes;
    } finally {
      await client.close();
    }
  }

  async function deleteRecipe(recipeId) {
    let client;

    try {
      client = new MongoClient(url, MONGO_DEFAULTS);
      await client.connect();
      console.log("Connected to Mongo Server");

      const mongo = client.db(DB_NAME);
      const myRecipesCollection = mongo.collection(COLLECTION_MYRECIPES);

      const query = {
        id: recipeId,
      };

      const result = await myRecipesCollection.deleteOne(query);
      return result;
    } finally {
      await client.close();
    }
  }

  async function updateRecipe(updatedRecipe) {
    console.log("got updatedRecipe", updatedRecipe);
    delete updatedRecipe._id;

    let client;

    try {
      client = new MongoClient(url, MONGO_DEFAULTS);
      await client.connect();
      console.log("Connected to Mongo Server");

      const mongo = client.db(DB_NAME);
      const myRecipesCollection = mongo.collection(COLLECTION_MYRECIPES);

      const filter = { id: updatedRecipe.id };
      const update = { $set: { ...updatedRecipe } };

      const result = await myRecipesCollection.updateOne(filter, update);
      return result;
    } finally {
      await client.close();
    }
  }

  db.getRecipe = getRecipe;
  db.checkRecipe = checkRecipe;
  db.createRecipe = createRecipe;
  db.addRecipe = addRecipe;
  db.saveRecipe = saveRecipe;
  db.getRecipes = getRecipes;
  db.deleteRecipe = deleteRecipe;
  db.updateRecipe = updateRecipe;
  /* ------Katerina end----- */

  return db;
}

export default MongoModule();
