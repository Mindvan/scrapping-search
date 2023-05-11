import React from 'react';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Limits = ({visibility, setVisibility}) => {
    const handleClick = () => {
        setVisibility(false);
    };

    return (
        <div className={`my-modal ${visibility ? 'active' : ''}`}>
            <div className='my-modal-content'>
                <FontAwesomeIcon size="2x" className='my-modal-close' icon={faXmark} onClick={handleClick}/>
                <label htmlFor='restrictions'> Number of restrictions (1-20):</label>
                <input type='number' id='restrictions' name='restrictions' min='1' max='20'/>
                <input type='submit' value='Save' onClick={handleClick}/>
            </div>
        </div>
    );
};

export default Limits;
