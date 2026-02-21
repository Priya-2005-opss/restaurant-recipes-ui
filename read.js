const fs = require("fs");

const data = fs.readFileSync("recipes.json", "utf-8");
const parsed = JSON.parse(data);


const recipes = Object.values(parsed);

const cleanedRecipes = recipes.map(recipe => ({
  cuisine: recipe.cuisine,
  title: recipe.title,
  rating: isNaN(recipe.rating) ? null : recipe.rating,
  prep_time: isNaN(recipe.prep_time) ? null : recipe.prep_time,
  cook_time: isNaN(recipe.cook_time) ? null : recipe.cook_time,
  total_time: isNaN(recipe.total_time) ? null : recipe.total_time,
  description: recipe.description,
  nutrients: recipe.nutrients,
  serves: recipe.serves
}));


console.log("Total recipes:", cleanedRecipes.length);
console.log("First recipe title:", cleanedRecipes[0].title);