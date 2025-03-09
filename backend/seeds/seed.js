// seeds/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

// Sample recipe data
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
  {
    title: 'Easy Homemade Pizza',
    ingredients: [
      '2 1/2 cups all-purpose flour',
      '1 teaspoon salt',
      '1 teaspoon sugar',
      '1 tablespoon active dry yeast',
      '1 cup warm water',
      '2 tablespoons olive oil',
      '1/4 cup tomato sauce',
      '1 cup shredded mozzarella cheese',
      'Toppings of your choice'
    ],
    instructions: [
      'In a large bowl, mix flour, salt, sugar, and yeast.',
      'Stir in water and oil until a soft dough forms.',
      'Turn onto a floured surface and knead until smooth, about 5 minutes.',
      'Place in a greased bowl, cover, and let rise for 30 minutes.',
      'Preheat oven to 450°F (230°C).',
      'Punch down dough and press into a greased pizza pan.',
      'Spread with tomato sauce, cheese, and desired toppings.',
      'Bake for 15-20 minutes or until crust is golden and cheese is melted.'
    ],
    category: 'Main Dishes',
    position: 2
  },
  {
    title: 'Fresh Garden Salad',
    ingredients: [
      '1 head romaine lettuce, chopped',
      '1 cucumber, diced',
      '1 bell pepper, diced',
      '1 cup cherry tomatoes, halved',
      '1/4 red onion, thinly sliced',
      '1/4 cup olive oil',
      '2 tablespoons balsamic vinegar',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Wash and prepare all vegetables.',
      'In a large bowl, combine lettuce, cucumber, bell pepper, tomatoes, and onion.',
      'In a small bowl, whisk together olive oil, balsamic vinegar, salt, and pepper.',
      'Pour dressing over salad and toss to coat.',
      'Serve immediately or refrigerate for up to 1 hour before serving.'
    ],
    category: 'Salads',
    position: 3
  },
  {
    title: 'Quick Vegetable Stir-Fry',
    ingredients: [
      '2 tablespoons vegetable oil',
      '1 onion, sliced',
      '2 bell peppers, sliced',
      '2 carrots, julienned',
      '1 cup broccoli florets',
      '2 cloves garlic, minced',
      '1 tablespoon ginger, minced',
      '3 tablespoons soy sauce',
      '1 tablespoon honey',
      '1 teaspoon sesame oil'
    ],
    instructions: [
      'Heat vegetable oil in a large wok or skillet over high heat.',
      'Add onion and stir-fry for 1 minute.',
      'Add bell peppers, carrots, and broccoli. Stir-fry for 3-4 minutes.',
      'Add garlic and ginger, stir-fry for 30 seconds until fragrant.',
      'Mix soy sauce, honey, and sesame oil in a small bowl.',
      'Pour sauce over vegetables and toss to coat.',
      'Cook for another 1-2 minutes until vegetables are crisp-tender.',
      'Serve over rice or noodles if desired.'
    ],
    category: 'Vegetarian',
    position: 4
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB for seeding');
    seedDatabase();
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });

// Seed function
async function seedDatabase() {
  try {
    // Check if database already has recipes
    const count = await Recipe.countDocuments();
    
    if (count === 0) {
      // Insert seed data only if database is empty
      console.log('Seeding database with initial recipes...');
      await Recipe.insertMany(recipeData);
      console.log('Seed data inserted successfully!');
    } else {
      console.log(`Database already has ${count} recipes, skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}