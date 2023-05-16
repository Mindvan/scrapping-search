import React, {useEffect, useState} from 'react';
import Search from './Search';
import List from './List';
import Pagination from './Pagination';
import Sort from "./Sort";

const Main = () => {
    // состояние, которое содержит данные, возвращаемые из сервера
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [sortBy, setSortBy] = useState('dateISO');

    const sortArticles = (articles, sortDirection, sortBy) => {
        const sortedArticles = [...articles];
        sortedArticles.sort((a, b) => {
            if (sortBy === "title") {
                return sortDirection === "ascending"
                    ? b.title.localeCompare(a.title)
                    : a.title.localeCompare(b.title);
            } else {
                return sortDirection === "ascending"
                    ? new Date(a.dateISO) - new Date(b.dateISO)
                    : new Date(b.dateISO) - new Date(a.dateISO);
            }
        });
        return sortedArticles;
    };


    const itemsPerPage = 5;
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems =
        Array.isArray(data) && data.length > 0
            ? sortArticles(data, sortDirection, sortBy).slice(
                indexOfFirstItem,
                indexOfLastItem
            )
            : [];

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleSortChange = (event) => {
        const { id } = event.target;
        const direction = id === sortBy ? (sortDirection === 'ascending' ? 'descending' : 'ascending') : 'ascending';
        setSortBy(id);
        setSortDirection(direction);
    };

    useEffect(() => {
        fetch(`/sort`)
            .then((response) => response.json())
            .then((data) => setData(sortArticles(data, sortDirection)))
            .catch((error) => setMessage(`Ошибка: ${error.message}`));
    }, [sortDirection]);

    // useEffect(() => {
    //     setData(data);
    // }, [data]);

    return (
        <div className='container'>
            <Search setData={setData} setMessage={setMessage}/>
            <Sort onSortChange={handleSortChange} setSortDirection={setSortDirection} setSortBy={setSortBy}/>
            <List data={currentItems} message={message} ssortDirection={sortDirection}/>
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
