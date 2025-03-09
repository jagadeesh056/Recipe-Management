import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateRecipePositions } from '../api';
import RecipeItem from './RecipeItem';
import './RecipeList.css';

const RecipeList = ({ recipes, onUpdate }) => {
  const [items, setItems] = useState(recipes);

  useEffect(() => {
    setItems(recipes);
  }, [recipes]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const newItems = [...items];
    const oldIndex = newItems.findIndex(i => i._id === active.id);
    const newIndex = newItems.findIndex(i => i._id === over.id);
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    // Update local state immediately
    setItems(newItems);

    // Update positions in DB
    try {
      const reorderedRecipes = newItems.map((item, index) => ({
        ...item,
        position: index + 1
      }));
      await updateRecipePositions(reorderedRecipes);
      onUpdate(); // Refresh the list from server
    } catch (error) {
      console.error('Failed to update positions:', error);
      setItems(items); // Revert if failed
    }
  };

  return (
    <div className="recipe-list-container">
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No recipes found. Add your first recipe!</p>
          <Link to="/new" className="add-first-button">Add Recipe</Link>
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map(recipe => (
              <RecipeItem key={recipe._id} recipe={recipe} />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default RecipeList;