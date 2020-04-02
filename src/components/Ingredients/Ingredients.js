import React, {
  useState,
  useCallback,
  useMemo,
  useReducer,
  useEffect
} from 'react';
import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import useHttp from '../../hooks/http';
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

// const httpReducer = (httpState, action) => { //moved to custom hook
//   switch (action.type) {
//     case 'REQ':
//       return { loading: true, error: null };
//     case 'RES':
//       return { ...httpState, loading: false };
//     case 'ERROR':
//       return { loading: false, error: action.error };
//     case 'CLEAR':
//       return { ...httpState, error: null };
//     default:
//       throw new Error('Should not get here');
//   }
// };

const Ingredients = () => {
  // const [ingredients, setIngredients] = useState([]);
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const httpState = useHttp();
  // const {loading, error, data, sendReq,  extra, identifier} = useHttp();
  ///U CAN ALSO USE DESCRTUCING ABOVE

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(false);

  useEffect(() => {
    if (!httpState.isLoading && httpState.identifier === 'remove') {
      dispatch({ type: 'DELETE', id: httpState.extra });
    } else if (
      !httpState.isLoading &&
      !httpState.error &&
      httpState.identifier === 'add'
    ) {
      dispatch({
        type: 'ADD',
        ingredient: { id: httpState.data.name, ...httpState.extra }
      });
    }
  }, [
    httpState.data,
    httpState.extra,
    httpState.identifier,
    httpState.error,
    httpState.isLoading
  ]);

  const filterIngredientsHandler = useCallback(ingredients => {
    //setIngredients(ingredients);
    dispatch({ type: 'SET', ingredients });
  }, []);
  const addIngredientsHandler = useCallback(
    async ingredient => {
      // console.log('add ingredient handler');
      // dispatchHttp({ type: 'REQ' });

      httpState.sendReq(
        'https://react-hooks-update-7dd74.firebaseio.com/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'add'
      );

      // try {
      //   const res = await fetch(
      //     'https://react-hooks-update-7dd74.firebaseio.com/ingredients.json',
      //     {
      //       method: 'POST',
      //       body: JSON.stringify(ingredient),
      //       headers: { 'Content-Type': 'application/json' }
      //     }
      //   );
      //   dispatchHttp({ type: 'RES' });
      //   const resJson = await res.json();
      //   dispatch({
      //     type: 'ADD',
      //     ingredient: { id: resJson.name, ...ingredient }
      //   });
      // } catch (err) {
      //   dispatchHttp({ type: 'ERROR', error: 'Something Went Wrong' });
      //   // setError(true);
      //   console.log(err);
      // }
    },
    [httpState.sendReq]
  );
  const removeIngredientHandler = useCallback(
    async id => {
      // try {
      //   dispatchHttp({ type: 'REQ' });
      //   await fetch(
      //     `https://react-hooks-update-7dd74.firebaseio.com/ingredients/${id}.json`,
      //     {
      //       method: 'DELETE',
      //       'Access-Control-Allow-Origin': '*'
      //     }
      //   );
      //   dispatchHttp({ type: 'RES' });
      httpState.sendReq(
        `https://react-hooks-update-7dd74.firebaseio.com/ingredients/${id}.json`,
        'DELETE',
        null,
        id,
        'remove'
      );
      //dispatch({ type: 'DELETE', id });
      // } catch (err) {
      //   dispatchHttp({ type: 'ERROR', error: true });
      // }
    },
    [httpState.sendReq]
  ); //if using custom hook, sendReq becomes a dependency
  const onClose = useCallback(() => {
    // dispatchHttp({ type: 'CLEAR' });
  });

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [ingredients, removeIngredientHandler]);
  return (
    <div className="App">
      <IngredientForm
        addIngredient={addIngredientsHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
        {httpState.error && (
          <ErrorModal onClose={onClose}>{httpState.error}</ErrorModal>
        )}
      </section>
    </div>
  );
};

export default Ingredients;
