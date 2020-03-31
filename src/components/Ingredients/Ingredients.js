import React, { useState, useCallback, useRef, useReducer } from 'react';
import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);

    default:
      throw new Error('Should not get here');
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'REQ':
      return { loading: true, error: null };
    case 'RES':
      return { ...httpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'CLEAR':
      return { ...httpState, error: null };
    default:
      throw new Error('Should not get here');
  }
};

const Ingredients = () => {
  // const [ingredients, setIngredients] = useState([]);
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(false);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });
  const filterIngredientsHandler = useCallback(ingredients => {
    // setIngredients(ingredients);
    dispatch({ type: 'SET', ingredients });
  }, []);
  const addIngredientsHandler = async ingredient => {
    dispatchHttp({ type: 'REQ' });
    try {
      const res = await fetch(
        'https://react-hooks-update-7dd74.firebaseio.com/ingredients.json',
        {
          method: 'POST',
          body: JSON.stringify(ingredient),
          headers: { 'Content-Type': 'application/json' }
        }
      );
      dispatchHttp({ type: 'RES' });

      const resJson = await res.json();

      //   setIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: resJson.name, ...ingredient }
      // ]);
      dispatch({
        type: 'ADD',
        ingredient: { id: resJson.name, ...ingredient }
      });
    } catch (err) {
      dispatchHttp({ type: 'ERROR', error: 'Something Went Wrong' });
      // setError(true);
      console.log(err);
    }
  };
  const removeIngredientHandler = async id => {
    try {
      dispatchHttp({ type: 'REQ' });
      const res = await fetch(
        `https://react-hooks-update-7dd74.firebaseio.com/ingredients/${id}.json`,
        {
          method: 'DELETE',
          'Access-Control-Allow-Origin': '*'
        }
      );
      dispatchHttp({ type: 'RES' });

      // setIngredient(prevIng => prevIng.filter(x => x.id !== id));
      dispatch({ type: 'DELETE', id });
    } catch (err) {
      dispatchHttp({ type: 'ERROR', error: true });
    }
  };
  const onClose = () => {
    dispatchHttp({ type: 'CLEAR' });
  };

  return (
    <div className="App">
      <IngredientForm
        addIngredient={addIngredientsHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
        {/* Need to add list here! */}
        {httpState.error && (
          <ErrorModal onClose={onClose}>{httpState.error}</ErrorModal>
        )}
      </section>
    </div>
  );
};

export default Ingredients;
