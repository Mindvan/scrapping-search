import React, {useState} from 'react';
import Search from './Search';
import List from './List';
import Pagination from './Pagination';

const Main = () => {
    // состояние, которое содержит данные, возвращаемые из сервера
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    return (
        <div className='container'>
            <Search setData={setData} setMessage={setMessage}/>
            <List data={data} message={message}/>
            <Pagination/>
        </div>
    );
};

export default Main;
