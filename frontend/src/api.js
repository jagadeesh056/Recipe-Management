import axios from 'axios';

const api = axios.create({
  baseURL: 'https://recipe-management-xyz.vercel.app/api/recipes',
});

export const fetchRandomRecipe = async () => {
  try {
    const response = await api.get('/random');
    return response.data;
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    if (error.response && error.response.status === 404) {
      // No recipes found
      return null;
    }
    throw error; // Re-throw for other errors
  }
};

export const fetchRecipes = () => api.get('/').then(res => res.data);
export const fetchRecipe = (id) => api.get(`/${id}`).then(res => res.data);
export const createRecipe = (recipe) => api.post('/', recipe).then(res => res.data);
export const updateRecipe = (id, updates) => api.put(`/${id}`, updates).then(res => res.data);
export const updateRecipePositions = (recipes) => 
  api.put('/reorder/positions', { reorderedRecipes: recipes }).then(res => res.data);