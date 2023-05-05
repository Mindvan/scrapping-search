import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Search = (props) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`/search?q=${query}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        const results = await response.json();
        console.log(results);
    };

    return (
        <form className="search" onSubmit={handleSubmit}>
            <input
                type='text'
                className="search__input"
                placeholder='Add query'
                value={query}
                onChange={handleInputChange} />
            <button type="submit" className='search__icon'>
                <FontAwesomeIcon size="2x" icon={faMagnifyingGlass} inverse/>
            </button>
        </form>
    );
};

export default Search;
