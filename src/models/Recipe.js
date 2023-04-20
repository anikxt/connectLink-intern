import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  recipeName: { type: String, required: true },
  description: { type: String, required: true },
  cookTime: { type: String, required: true },
  servings: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  username: { type: String, required: true },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
