import React, {useState} from 'react';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Checkbox from "./Checkbox";

const Featured = ({ visibility, setVisibility }) => {
    const [checkedItems, setCheckedItems] = useState({
        'РБК': true,
        'Коммерсантъ': true,
        'РИА Новости': false,
        'Газета': false,
        'RTVI': false,
    });

    const handleClose = () => {
        setVisibility(false);
    };

    const handleReset = () => {
        setCheckedItems((prev) => {
            const newState = { ...prev };
            for (let key in newState) {
                newState[key] = false;
            }
            return newState;
        });
    };

    const handleClick = () => {
        console.log(checkedItems);

        try {
            fetch('/save-websites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({checkedItems}),
            }).then(response => response.json()).then(data => console.log(data));
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={`popup ${visibility ? 'active' : ''}`}>
            <div className="popup-content featured-websites">
                <FontAwesomeIcon
                    size="2x"
                    className="popup-close"
                    icon={faXmark}
                    onClick={handleClose}
                />
                <h1 className="feature__title">My feature websites</h1>
                <div className="feature-list">
                    {Object.entries(checkedItems).map(([key, value]) => (
                        <Checkbox
                            key={key}
                            checked={value}
                            onChange={(e) =>
                                setCheckedItems((prev) => ({
                                    ...prev,
                                    [key]: e.target.checked,
                                }))
                            }
                            label={key}
                        />
                    ))}
                </div>
                <div className="feature__options">
                    <input
                        type="submit"
                        className="feature__options-save"
                        value="Save"
                        onClick={handleClick}
                    />
                    <input
                        type="button"
                        className="feature__options-clean"
                        value="Clean"
                        onClick={handleReset}
                    />
                </div>
            </div>
        </div>
    );
};

export default Featured;
