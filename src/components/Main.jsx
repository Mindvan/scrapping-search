import React, {useState} from 'react';
import Search from './Search';
import List from './List';
import Pagination from './Pagination';

const Main = () => {
    // состояние, которое содержит данные, возвращаемые из сервера
    const [data, setData] = useState([]);

    return (
        <div className='container'>
            <Search setData={setData}/>
            <List data={data}/>
            <Pagination/>
        </div>
    );
};

export default Main;
