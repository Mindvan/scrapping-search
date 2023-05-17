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
        img: '',
        date: '',
        dateISO: ''
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

    return (
        <div className={`popup ${visibility ? 'active' : ''}`}>
            <div className='popup-content add-selectors'>
                <FontAwesomeIcon size="2x" className='popup-close' icon={faXmark} onClick={handleClose}/>
                <h2>Add new website</h2>
                <div className='add-list'>
                    <label className='add-item'>
                        <span>Название веб-сайта</span>
                        <input
                               type="text"
                               name="name"
                            //value='https://lenta.ru/search?query='
                               value={selectors.name}
                               onChange={handleInputChange}
                               className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Запрос query</span>
                        <input required
                            type="text"
                            name="query"
                               //value='https://lenta.ru/search?query='
                            value={selectors.query}
                            onChange={handleInputChange}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Контейнер статьи</span>
                        <input required
                               type="text"
                               name="article"
                               //value='.search-results__item'
                               value={selectors.article}
                               onChange={handleInputChange}
                               className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Ссылка на статью</span>
                        <input required
                            type="text"
                            name="link"
                               //value='.search-results__item > a'
                            value={selectors.link}
                            onChange={handleInputChange}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Заголовок статьи</span>
                        <input required
                            type="text"
                            name="title"
                               //value='.card-full-news__title'
                            value={selectors.title}
                            onChange={handleInputChange}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Абзац статьи</span>
                        <input required
                            type="text"
                            name="paragraph"
                             //  value='.topic-body__content-text'
                            value={selectors.paragraph}
                            onChange={handleInputChange}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Изображение статьи (при наличии)</span>
                        <input
                            type="text"
                            name="img"
                            onChange={handleInputChange}
                            //value='.picture__image'
                            value={selectors.img}
                            className='feature__input'
                        />
                    </label>
                    <label className='add-item'>
                        <span>Дата статьи (при наличии)</span>
                        <input
                            type="text"
                            name="dateISO"
                            onChange={handleInputChange}
                            value={selectors.dateISO}
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
