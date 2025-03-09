import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import styles from './RecipeItem.css';

const RecipeItem = ({ recipe }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: recipe._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <Link to={`/recipe/${recipe._id}`} style={{ textDecoration: 'none' }}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={styles.item}
      >
        <h3>{recipe.title}</h3>
        <p>{recipe.ingredients.length} ingredients</p>
      </div>
    </Link>
  );
};

export default RecipeItem;