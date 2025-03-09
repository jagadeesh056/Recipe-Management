import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import RecipeDetails from './components/RecipeDetails';
import { fetchRecipes, fetchRandomRecipe } from './api';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // Load recipes from the backend
  const loadRecipes = async () => {
    try {
      const data = await fetchRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  // Fetch recipes on component mount
  useEffect(() => {
    loadRecipes();
  }, []);

  // Handle new recipe creation
  const handleNewRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
  };

  // Handle "Surprise Me" button click
const handleSurpriseMe = async () => {
  try {
    const random = await fetchRandomRecipe();
    if (random && random._id) {
      navigate(`/recipe/${random._id}`);
    } else {
      alert('No recipes found! Add some recipes first.');
    }
  } catch (error) {
    console.error('Error:', error);
    // Show a more helpful error message
    let errorMessage = 'Failed to fetch random recipe. Please try again.';
    if (error.response) {
      errorMessage += ` Server error: ${error.response.status}`;
    }
    alert(errorMessage);
  }
};

  return (
    <div className="app-container">
      <nav className="app-nav">
        <Link to="/" className="nav-brand">
          🍳 Recipe Manager
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/new" className="nav-link">
            Add Recipe
          </Link>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="header-section">
                <h1 className="app-title">All Recipes</h1>
                <button className="surprise-button" onClick={handleSurpriseMe}>
                  Surprise Me!
                </button>
              </div>
              <RecipeList recipes={recipes} onUpdate={loadRecipes} />
            </>
          }
        />
        <Route path="/new" element={<RecipeForm onSuccess={handleNewRecipe} />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </div>
  );
}

// Wrap App with Router
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}