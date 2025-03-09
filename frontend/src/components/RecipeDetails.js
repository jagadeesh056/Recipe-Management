import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipe } from '../api';
import './RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const data = await fetchRecipe(id);
        setRecipe(data);
        setError('');
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="error">Recipe not found</div>;

  return (
    <div className="recipe-details-container">
      <Link to="/" className="back-button">&larr; Back to Recipes</Link>
      
      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <div className="recipe-meta">
          <span className="category">Category: {recipe.category}</span>
          <span className="ingredient-count">{recipe.ingredients.length} ingredients</span>
          <span className="created-date">
            Added: {new Date(recipe.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="recipe-content">
        <div className="ingredients-section">
          <h2>Ingredients</h2>
          <ul className="ingredient-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                <span className="ingredient-number">{index + 1}.</span>
                <span className="ingredient-text">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-section">
          <h2>Instructions</h2>
          <ol className="instruction-list">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="instruction-step">
                <span className="step-number">{index + 1}.</span>
                <span className="step-text">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;