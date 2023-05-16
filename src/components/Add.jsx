import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

const Add = ({visibility, setVisibility}) => {
    const [selectors, setSelectors] = useState({
        name: '',
        query: '',
        title: '',
        link: '',
        article: '',
        paragraph: '',
        img: ''
    });

    const handleClose = () => {
        setVisibility(false);
    };

    const handleClick = () => {
        try {
            fetch('/add-website', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({selectors}),
            }).then(response => response.json()).then(data => console.log(data));
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleReset = (e) => {
        setSelectors({
            name: '',
            query: '',
            title: '',
            paragraph: '',
            img: ''
        });
    };

    const handleInputChange = (e) => {
        setSelectors({
            ...selectors,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={`popup ${visibility ? 'active' : ''}`}>
            <div className='popup-content add-selectors'>
                <FontAwesomeIcon size="2x" className='popup-close' icon={faXmark} onClick={handleClose}/>
                <h2>Add new website</h2>
                <div className='add-list'>
                    <label className='add-item'>
                        <span>Website Name</span>
                        <input
                            type="text"
                            name="name"
                            onChange={handleInputChange}
                            value={selectors.name}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Website search query</span>
                        <input required
                            type="text"
                            name="query"
                            value={selectors.query}
                            onChange={handleInputChange}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Paragraphs of the article</span>
                        <input required
                               type="text"
                               name="article"
                               value={selectors.article}
                               onChange={handleInputChange}
                               className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Link to the article</span>
                        <input required
                            type="text"
                            name="link"
                            value={selectors.link}
                            onChange={handleInputChange}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Article title</span>
                        <input required
                            type="text"
                            name="title"
                            value={selectors.title}
                            onChange={handleInputChange}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Paragraphs of the article</span>
                        <input required
                            type="text"
                            name="paragraph"
                            value={selectors.paragraph}
                            onChange={handleInputChange}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Image of the article (if any)</span>
                        <input
                            type="text"
                            name="img"
                            onChange={handleInputChange}
                            value={selectors.img}
                            className='feature__input'
                        />
                    </label>
                </div>
                <div className='feature__options'>
                    <input type='button' value='Save' className='feature__options-save' onClick={handleClick}/>
                    <input type='button' value='Clean' className='feature__options-clean' onClick={handleReset}/>
                </div>
            </div>
        </div>
    );
};

export default Add;
