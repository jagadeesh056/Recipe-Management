const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET random recipe - this MUST come before the /:id route
router.get('/random', async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No recipes found' });
    }
    
    const random = await Recipe.aggregate([
      { $sample: { size: 1 } }
    ]);
    
    res.status(200).json(random[0]);
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    res.status(500).json({ message: 'Error fetching random recipe', error: error.message });
  }
});

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort('position');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
});

// GET single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error });
  }
});

// POST new recipe
router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      position: (await Recipe.countDocuments()) + 1
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error });
  }
});

// PUT update recipe
router.put('/:id', async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error updating recipe', error });
  }
});

// PUT update positions (for drag-and-drop)
router.put('/reorder/positions', async (req, res) => {
  try {
    const { reorderedRecipes } = req.body;
    
    const bulkOps = reorderedRecipes.map(recipe => ({
      updateOne: {
        filter: { _id: recipe._id },
        update: { $set: { position: recipe.position } }
      }
    }));

    await Recipe.bulkWrite(bulkOps);
    res.status(200).json({ message: 'Positions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating positions', error });
  }
});

module.exports = router;