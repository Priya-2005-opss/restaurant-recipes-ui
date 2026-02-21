const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "recipes_db",
  password: "postgres123",
  port: 5432,
});


// ✅ GET recipes with pagination
app.get("/api/recipes", async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const offset = (page - 1) * limit;

  try {

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM recipes"
    );

    const result = await pool.query(
      "SELECT * FROM recipes ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json({
      page: page,
      limit: limit,
      total: parseInt(totalResult.rows[0].count),
      data: result.rows
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ error: "Server error" });

  }

});


// ✅ SEARCH recipes
app.get("/api/recipes/search", async (req, res) => {

  const title = req.query.title;

  try {

    const result = await pool.query(
      "SELECT * FROM recipes WHERE title ILIKE $1",
      [`%${title}%`]
    );

    res.json({
      data: result.rows
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ error: "Search error" });

  }

});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
