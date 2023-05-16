import React from 'react';
import logo from '../icons/scraper-search.png';

const Navigation = (props) => {

    function handleAddClick() {
        props.setModalAdd(true);
    }

    function handleFeaturedClick() {
        props.setModalFeatured(true);
    }

    function handleLimitsClick() {
        props.setModalLimits(true);
    }

    return (
        <header className='nav'>
            <div className='nav-content'>
                <img src={logo} className='nav__logo' alt='website logo'/>
                <ul className='nav-list'>
                    <li className='nav-list__option' onClick={handleAddClick}>
                        Add
                    </li>
                    <li className='nav-list__option' onClick={handleFeaturedClick}>
                        Featured websites
                    </li>
                    <li className='nav-list__option' onClick={handleLimitsClick}>
                        Limit
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Navigation;
