import React from 'react';

const Checkbox = ({ checked, onChange, label }) => {
    return (
        <label className="feature-item">
            <label className="toggler-wrapper style-12">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <div className="toggler-slider">
                    <div className="circle">

                    </div>
                </div>
            </label>
            <span>{label}</span>
        </label>
    );
};

export default Checkbox;
