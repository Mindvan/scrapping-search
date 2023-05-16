import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { io } from 'socket.io-client';
const socket = io('http://localhost:3000', {
    transports: ['websocket']
});


const Search = (props) => {
    const [query, setQuery] = useState('');
    //const [message, setMessage] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        props.setData([]); // очистка данных
        props.setMessage('Запрос отправлен, ожидайте...');

        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            console.log('WebSocket client connected');
        };
        ws.onmessage = (event) => {
            console.log(event.data);
            props.setMessage(event.data);
        };

        const response = await fetch(`/search?q=${query}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const results = await response.json();
        console.log(results);
        props.setData(results);

        console.log(props.data);
        //props.setData(results);
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

