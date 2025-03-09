const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  ingredients: {
    type: [String],
    required: [true, 'At least one ingredient is required']
  },
  instructions: {
    type: [String],
    required: [true, 'Instructions are required']
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  position: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);