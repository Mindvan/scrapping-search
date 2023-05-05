import React from 'react';

const Featured = () => {
    return (
        <div className='container'>
            <h1 className='feature__title'>My feature websites</h1>
            <div className='feature-list'>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
                <input type="text" className='feature__input'/>
            </div>
            <div className='feature__options'>
                <button className='feature__options-save'>
                    Save
                </button>
                <button className='feature__options-clean'>
                    Clean
                </button>
            </div>
        </div>
    );
};

export default Featured;
