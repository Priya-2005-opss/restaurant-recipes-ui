const fs = require("fs");
const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "recipes_db",
  password: "postgres123",
  port: 5432,
});

client.connect();

const data = fs.readFileSync("recipes.json", "utf-8");

// 🔥 convert object → array
const recipesObject = JSON.parse(data);
const recipes = Object.values(recipesObject);

async function insertData() {
  for (let recipe of recipes) {
    await client.query(
      `INSERT INTO recipes
      (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        recipe.cuisine,
        recipe.title,
        recipe.rating,
        recipe.prep_time,
        recipe.cook_time,
        recipe.total_time,
        recipe.description,
        JSON.stringify(recipe.nutrients),
        recipe.serves,
      ]
    );
  }

  console.log("✅ Data Imported Successfully");
  client.end();
}

insertData();