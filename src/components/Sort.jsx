import React, {useState} from 'react';

const Sort = ({onSortChange, setSortDirection, setSortBy}) => {
    const [activeButton, setActiveButton] = useState('ascending');

    const handleSortChange = (event) => {
        const { id } = event.target;
        let direction, sortBy;
        if (id === "ascending" || id === "descending") {
            direction = id === "ascending" ? "descending" : "ascending";
            sortBy = "date-" + direction;
        } else if (id === "title") {
            direction = activeButton === "title" ? "title" : "title";
            sortBy = direction;
        }
        setActiveButton(direction);
        setSortDirection(direction);
        setSortBy(sortBy);
    };

    return (
        <div className='sort'>
            <button
                className={`sort__button ${activeButton === 'descending' ? 'sort__button-active' : ''}`}
                id='ascending'
                onClick={handleSortChange}
            >
                ascending
            </button>
            <button
                className={`sort__button ${activeButton === 'ascending' ? 'sort__button-active' : ''}`}
                id='descending'
                onClick={handleSortChange}
            >
                descending
            </button>
            <button
                className={`sort__button ${activeButton === 'title' || activeButton === 'title' ? 'sort__button-active' : ''}`}
                id='title'
                onClick={handleSortChange}
            >
                by title
            </button>
        </div>
    );
};


export default Sort;
