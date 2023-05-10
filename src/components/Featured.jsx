import React from 'react';

const Featured = () => {
    return (
        <div className='container'>
            <h1 className='feature__title'>My feature websites</h1>
            <div className='feature-list'>
                <label className="feature-item">
                    <input type="checkbox" name="websites" className='feature__input'/>
                    <span>РБК</span>
                </label>
                <label className="feature-item">
                    <input type="checkbox" name="websites" className='feature__input'/>
                    <span>Коммерсантъ</span>
                </label>
                <label className="feature-item">
                    <input type="checkbox" name="websites" className='feature__input'/>
                    <span>РИА Новости</span>
                </label>
                <label className="feature-item">
                    <input type="checkbox" name="websites" className='feature__input'/>
                    <span>Газета</span>
                </label>
                <label className="feature-item">
                    <input type="checkbox" name="websites" className='feature__input'/>
                    <span>RTVI</span>
                </label>
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
