// server.js (modified to include auto-seeding)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');
const loggerMiddleware = require('./middlewares/logger');
const Recipe = require('./models/Recipe');

const app = express();
const PORT = process.env.PORT || 5000;

// Sample recipe data for seeding
const recipeData = [
  {
    title: 'Classic Chocolate Chip Cookies',
    ingredients: [
      '1 cup butter, softened',
      '1 cup white sugar',
      '1 cup packed brown sugar',
      '2 eggs',
      '2 teaspoons vanilla extract',
      '3 cups all-purpose flour',
      '1 teaspoon baking soda',
      '2 teaspoons hot water',
      '1/2 teaspoon salt',
      '2 cups semisweet chocolate chips'
    ],
    instructions: [
      'Preheat oven to 350 degrees F (175 degrees C).',
      'Cream together the butter, white sugar, and brown sugar until smooth.',
      'Beat in the eggs one at a time, then stir in the vanilla.',
      'Dissolve baking soda in hot water. Add to batter along with salt.',
      'Stir in flour and chocolate chips.',
      'Drop by large spoonfuls onto ungreased pans.',
      'Bake for about 10 minutes or until edges are nicely browned.'
    ],
    category: 'Desserts',
    position: 1
  },
  // Other recipes same as in the first script...
];

// Async function to check and seed database if empty
async function checkAndSeedDatabase() {
  try {
    const count = await Recipe.countDocuments();
    
    if (count === 0) {
      console.log('No recipes found in database. Seeding initial recipes...');
      await Recipe.insertMany(recipeData);
      console.log('Database seeded with initial recipes!');
    } else {
      console.log(`Database already contains ${count} recipes.`);
    }
  } catch (error) {
    console.error('Error checking/seeding database:', error);
  }
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Check and seed database upon successful connection
    checkAndSeedDatabase();
  })
  .catch(err => console.error('Connection error:', err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use('/api/recipes', recipeRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));