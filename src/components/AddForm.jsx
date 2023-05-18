import React from 'react';
import AddItem from "./AddItem";

const AddForm = ({ selectors, handleInputChange }) => (
    <div className='add-list'>
        <AddItem
            label='Название веб-сайта'
            name='name'
            value={selectors.name}
            onChange={handleInputChange}
        />
        <AddItem
            label='Запрос query'
            name='query'
            value={selectors.query}
            onChange={handleInputChange}
            required
        />
        <AddItem
            label='Контейнер статьи'
            name='article'
            value={selectors.article}
            onChange={handleInputChange}
            required
        />
        <AddItem
            label='Ссылка на статью'
            name='link'
            value={selectors.link}
            onChange={handleInputChange}
            required
        />
        <AddItem
            label='Заголовок статьи'
            name='title'
            value={selectors.title}
            onChange={handleInputChange}
            required
        />
        <AddItem
            label='Абзац статьи'
            name='paragraph'
            value={selectors.paragraph}
            onChange={handleInputChange}
            required
        />
        <AddItem
            label='Изображение статьи (при наличии)'
            name='img'
            value={selectors.img}
            onChange={handleInputChange}
        />
        <AddItem
            label='Дата статьи (при наличии)'
            name='dateISO'
            value={selectors.dateISO}
            onChange={handleInputChange}
        />
    </div>
);

export default AddForm;
