import React from 'react';

const Article = (props) => {
    console.log(props.article.icon);
        return (
            <div className='list-item'>
                <div className='list-item__source'>
                    <img
                        src={props.article.icon}
                        className='list-item__icon'
                        alt="icon"
                    >
                    </img>
                    <div className='list-item__website'>
                        {props.article.website}
                    </div>
                </div>
                <div className='list-item__title'>
                    {props.article.title}
                </div>
                <p className='list-item__paragraph'>
                    {props.article.text}
                </p>
            </div>
    );
};

export default Article;
