import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import AddForm from "./AddForm";

const Add = ({visibility, setVisibility}) => {
    const [selectors, setSelectors] = useState({
        name: '',
        query: '',
        title: '',
        link: '',
        article: '',
        paragraph: '',
        img: '',
        date: '',
        dateISO: ''
    });

    const [valid, setValid] = useState("");

    const handleClose = () => {
        setVisibility(false);
        setValid('');
    };

    const handleClick = async (event) => {
        event.preventDefault();
        setValid('Запрос отправлен, ожидайте...');

        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            console.log('WebSocket client connected');
        };
        ws.onmessage = (event) => {
            console.log(event.data);
            setValid(event.data);
        };

        fetch('/add-website', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({selectors}),
        }).then(response => response.json()).then(data => console.log(data));
    };

    const handleReset = (e) => {
        setSelectors({
            name: '',
            query: '',
            title: '',
            link: '',
            article: '',
            paragraph: '',
            img: '',
            date: '',
            dateISO: ''
        });
    };

    const handleInputChange = (e) => {
        setSelectors({
            ...selectors,
            [e.target.name]: e.target.value,
        });
    };

    // const handleWebSocketMessage = (event) => {
    //     event.preventDefault();
    //     const data = JSON.parse(event.data);
    //     setValid(data.message);
    //
    //     const ws = new WebSocket('ws://localhost:8080');
    //     ws.onopen = () => {
    //         console.log('WebSocket client connected 2');
    //     };
    //     ws.onmessage = (event) => {
    //         console.log(event.data);
    //         setValid(event.data);
    //     };
    //
    // };

    return (
        <div className={`popup ${visibility ? 'active' : ''}`}>
            <div className='popup-content add-selectors'>
                <FontAwesomeIcon size="2x" className='popup-close' icon={faXmark} onClick={handleClose}/>
                <h2>Add new website</h2>
                <AddForm selectors={selectors} handleInputChange={handleInputChange}/>
                <div className='feature__options'>
                    <input type='button' value='Save' className='feature__options-save' onClick={handleClick}/>
                    <input type='button' value='Clean' className='feature__options-clean' onClick={handleReset}/>
                </div>
                <span className='feature__loading'>{valid}</span>
            </div>
        </div>
    );
};

export default Add;
