import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../api';
import './RecipeForm.css';

const RecipeForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    ingredients: [''],
    instructions: [''],
    category: 'Uncategorized'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Recipe title is required';
    }
    
    if (formData.ingredients.some(ing => !ing.trim())) {
      newErrors.ingredients = 'All ingredients must be filled';
    }
    
    if (formData.instructions.some(inst => !inst.trim())) {
      newErrors.instructions = 'All instructions must be filled';
    }

    return newErrors;
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = formData[field].map((item, i) => 
      i === index ? value : item
    );
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const newRecipe = await createRecipe(formData);
      onSuccess(newRecipe);
      navigate('/');
    } catch (error) {
      setErrors({ form: 'Failed to save recipe. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      {errors.form && <div className="form-error global-error">{errors.form}</div>}

      <div className="form-group">
        <label>Recipe Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, title: e.target.value }));
            setErrors(prev => ({ ...prev, title: '' }));
          }}
          className={errors.title ? 'error-field' : ''}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Ingredients *</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="array-field">
            <input
              value={ingredient}
              onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
              className={errors.ingredients ? 'error-field' : ''}
            />
            {formData.ingredients.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => removeArrayField('ingredients', index)}
                disabled={submitting}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="add-button"
          onClick={() => addArrayField('ingredients')}
          disabled={submitting}
        >
          Add Ingredient
        </button>
        {errors.ingredients && <span className="form-error">{errors.ingredients}</span>}
      </div>

      <div className="form-group">
        <label>Instructions *</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="array-field">
            <textarea
              value={instruction}
              onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
              className={errors.instructions ? 'error-field' : ''}
            />
            {formData.instructions.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => removeArrayField('instructions', index)}
                disabled={submitting}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="add-button"
          onClick={() => addArrayField('instructions')}
          disabled={submitting}
        >
          Add Step
        </button>
        {errors.instructions && <span className="form-error">{errors.instructions}</span>}
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={submitting}
      >
        {submitting ? 'Saving...' : 'Save Recipe'}
      </button>
    </form>
  );
};

export default RecipeForm;