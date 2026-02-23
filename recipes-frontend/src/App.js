import { useEffect, useState } from "react";

function App() {

  const [recipes, setRecipes] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const limit = 8;


  useEffect(() => {

    fetch(`http://localhost:5000/api/recipes?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {

        setRecipes(data.data || []);
        setTotal(data.total);

      })
      .catch(err => console.log(err));

  }, [page]);

  const renderStars = (rating) => {

    if (!rating) {
      return (
        <span style={{
          backgroundColor: "#9ca3af",
          color: "white",
          padding: "4px 10px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "bold"
        }}>
          No rating
        </span>
      );
    }

    return (
      <span style={{
        backgroundColor: "#16a34a",
        color: "white",
        padding: "5px 12px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "bold"
      }}>
        {rating} ★
      </span>
    );

  };

  const renderNutrients = (nutrients) => {

    if (!nutrients || nutrients === "null")
      return "No nutrients data";

    try {

      const parsed = JSON.parse(nutrients);

      return (

        <table border="1" cellPadding="3">
          <tbody>

            {Object.entries(parsed).map(([key, value]) => (

              <tr key={key}>
                <td>{key.replace("Content", "")}</td>
                <td>{value}</td>
              </tr>

            ))}

          </tbody>
        </table>

      );

    } catch {

      return "No nutrients data";

    }

  };

  const handleSearch = () => {

    if (searchTitle.trim() === "") {

      fetch(`http://localhost:5000/api/recipes?page=1&limit=${limit}`)
        .then(res => res.json())
        .then(data => {

          setRecipes(data.data);
          setTotal(data.total);
          setPage(1);

        });

    }
    else {

      fetch(`http://localhost:5000/api/recipes/search?title=${searchTitle}`)
        .then(res => res.json())
        .then(data => {

          setRecipes(data.data);
          setTotal(data.data.length);
          setPage(1);

        });

    }

  };


  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  };


  return (

<div style={{
  padding: "30px",
  minHeight: "100vh",
  backgroundImage: "url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65')",
  backgroundSize: "cover"
}}>
<h1 style={{
  textAlign: "center",
  color: "green"
}}>
  🍽️ Recipe Radar
</h1>

<div style={{ textAlign: "center", marginBottom: "20px" }}>

  <input
    value={searchTitle}
    onChange={(e) => setSearchTitle(e.target.value)}
    placeholder="Search recipes..."
    style={{
      padding: "10px",
      width: "300px"
    }}
  />

  <button
    onClick={handleSearch}
    style={{
      padding: "10px 20px",
      backgroundColor: "#3498db",
      color: "white",
      marginLeft: "10px",
      border: "none"
    }}
  >
    Search
  </button>

</div>

<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
  gap: "25px"
}}>

{recipes.map(recipe => (

<div
  key={recipe.id}
  onClick={() => setSelectedRecipe(recipe)}

  style={{

    backgroundColor: "#c5b47d",
    padding: "20px",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease"
  }}

  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#e6d39b";
    e.currentTarget.style.transform = "scale(1.05)";
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "#c5b47d";
    e.currentTarget.style.transform = "scale(1)";
  }}

>

<h3>{recipe.title}</h3>

<p>{recipe.cuisine}</p>

{renderStars(recipe.rating)}

<p>{recipe.serves}</p>

</div>

))}

</div>

<div style={{ textAlign: "center", marginTop: "20px" }}>

<button
onClick={() => setPage(page - 1)}
disabled={page === 1}
style={buttonStyle}
>
Previous
</button>

<span style={{ margin: "15px" }}>
Page {page}
</span>

<button
onClick={() => setPage(page + 1)}
disabled={page * limit >= total}
style={buttonStyle}
>
Next
</button>

</div>
{selectedRecipe && (

<div style={{
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}}>

<div style={{
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "15px",
  width: "500px",
  maxHeight: "80vh",
  overflowY: "auto"
}}>

<h2>{selectedRecipe.title}</h2>

<p><b>Cuisine:</b> {selectedRecipe.cuisine}</p>

<p><b>Rating:</b> {selectedRecipe.rating}</p>

<p><b>Prep Time:</b> {selectedRecipe.prep_time}</p>

<p><b>Cook Time:</b> {selectedRecipe.cook_time}</p>

<p><b>Total Time:</b> {selectedRecipe.total_time}</p>

<p><b>Serves:</b> {selectedRecipe.serves}</p>

<p><b>Description:</b> {selectedRecipe.description}</p>

<b>Nutrients:</b>

{renderNutrients(selectedRecipe.nutrients)}

<br/><br/>

<button
onClick={() => setSelectedRecipe(null)}
style={{
  padding: "10px",
  backgroundColor: "red",
  color: "white",
  border: "none"
}}
>
Close
</button>

</div>

</div>

)}

</div>

);

}

export default App;
