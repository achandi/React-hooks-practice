import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [filter, setFilter] = useState('');
  const { onLoadIngredients } = props;
  const inputRef = useRef();
  useEffect(() => {
    async function fetchData() {
      try {
        const query =
          filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
        const res = await fetch(
          'https://react-hooks-update-7dd74.firebaseio.com/ingredients.json' +
            query
        );
        const resJson = await res.json();
        onLoadIngredients(
          Object.keys(resJson).map(key => ({
            id: key,
            title: resJson[key].title,
            amount: resJson[key].amount
          }))
        );
      } catch (err) {
        console.log(err);
      }
    }
    const timer = setTimeout(() => {
      if (filter === inputRef.current.value) {
        fetchData();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, onLoadIngredients, inputRef]); //pass as a dependency to update whenever filter changes only
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            value={filter}
            onChange={event => setFilter(event.target.value)}
            type="text"
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
