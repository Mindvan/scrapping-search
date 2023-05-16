import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ totalItems, currentPage, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        onPageChange(pageNumber);
    };
    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className='pagination'>
            <div
                className={`pagination__left ${currentPage === 1 ? 'pagination__disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                <FontAwesomeIcon size='2x' icon={faCaretLeft} />
            </div>
            {generatePageNumbers().map((pageNumber) => (
                <div
                    key={pageNumber}
                    className={`pagination__number ${pageNumber === currentPage ? 'pagination__active' : ''}`}
                    onClick={() => handlePageChange(pageNumber)}
                >
                    {pageNumber}
                </div>
            ))}
            <div
                className={`pagination__right ${
                    currentPage === totalPages ? 'pagination__disabled' : ''
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                <FontAwesomeIcon size='2x' icon={faCaretRight} />
            </div>
        </div>
    );
};

export default Pagination;
