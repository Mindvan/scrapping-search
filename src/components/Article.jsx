import React from 'react';
import def from '../img/default.jpg';

const Article = (props) => {
    function openLink(url) {
        window.open(url, '_blank');
    }

    console.log(props);
        return (
            <div className='list-item' onClick={() => openLink(props.article.link)}>
                <div className="list-item__meta">
                    <div className='list-item__source'>
                        <img
                            src={props.article.favicon}
                            className='list-item__icon'
                            alt="icon"
                        >
                        </img>
                        <div className='list-item__website'>
                            {props.article.domain}
                        </div>
                    </div>
                    <div className='list-item__date'>
                        {props.article.date ? props.article.date : 'TBD'}
                    </div>
                </div>
                <div className="list-item__content">
                    <div className='list-item__title'>
                        {props.article.title}
                    </div>
                    <p className='list-item__paragraph'>
                        {props.article.text}
                        {/*{props.article.text + '…'}*/}
                    </p>
                    <img
                        src = {props.article.img ? props.article.img : def}
                        // src={props.article.img}
                        alt = 'article-image'
                        className='list-item__image'/>
                </div>
            </div>
    );
};

export default Article;
