import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretLeft, faCaretRight} from '@fortawesome/free-solid-svg-icons';

const Pagination = () => {
    return (
        <div className='pagination'>
            <div className='pagination__left'>
                <FontAwesomeIcon size="2x" icon={faCaretLeft}/>
            </div>
            <div className='pagination__active'>
                1
            </div>
            <div className='pagination__top'>
                <FontAwesomeIcon size="2x" icon={faCaretRight}/>
            </div>
        </div>
    );
};

export default Pagination;
