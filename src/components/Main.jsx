import React, {useEffect, useState} from 'react';
import Search from './Search';
import List from './List';
import Pagination from './Pagination';

const Main = () => {
    // состояние, которое содержит данные, возвращаемые из сервера
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);

    const itemsPerPage = 5;

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(data) && data.length > 0 ? data.slice(indexOfFirstItem, indexOfLastItem) : [];
    console.log(page);

    // обработчик изменения страницы
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    useEffect(() => {
        setData(data);
    }, [data]);

    return (
        <div className='container'>
            <Search setData={setData} setMessage={setMessage}/>

            <List data={currentItems} message={message}/>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={data.length} // передаем общее количество элементов
                currentPage={page}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Main;
