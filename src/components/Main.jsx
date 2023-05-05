import React from 'react';
import Search from './Search';
import List from './List';
import Pagination from './Pagination';

const Main = () => {
    return (
        <div className='container'>
            <Search/>
            <List/>
            <Pagination/>
        </div>
    );
};

export default Main;
