import React, {useState} from 'react';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Limits = ({visibility, setVisibility}) => {
    const [restrictions, setRestrictions] = useState(3);

    const handleClose = () => {
        setVisibility(false);
    };

    const handleClick = () => {
        console.log(restrictions);
        console.log({restrictions});

        try {
            if (restrictions !== undefined) {
                fetch('/save-restrictions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({restrictions}),
                }).then(response => response.json()).then(data => console.log(data));
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        setRestrictions(e.target.value);
        console.log(restrictions);
    };

return (
        <div className={`popup ${visibility ? 'active' : ''}`}>
            <div className='popup-content'>
                <FontAwesomeIcon size="2x" className='popup-close' icon={faXmark} onClick={handleClose}/>
                <label htmlFor='restrictions'> Number of restrictions (1-20):</label>
                <input type='number' id='restrictions' name='restrictions' min='1' max='20' value={restrictions} onChange={handleInputChange} />
                <input type='submit' value='Save' onClick={handleClick}/>
            </div>
        </div>
    );
};

export default Limits;
