import React from 'react';

const AddItem = ({ label, name, value, onChange, required = false }) => (
    <label className='add-item'>
            <span>{label}</span>
            <input
                type='text'
                name={name}
                value={value}
                onChange={onChange}
                className='feature__input'
                required={required}
            />
    </label>
);

export default AddItem;
