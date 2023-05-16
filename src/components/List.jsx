import React, {useState} from 'react';
import Article from './Article';
import {ScaleLoader} from "react-spinners";

const List = (props) => {

    return (
        <div className='list'>
            {props.data.map((article) => (
                <Article article={article} key={article.index} />
            ))}
            <div className='message'>
                {props.message.length
                    ? <ScaleLoader
                        height='20px'
                        width='5px'
                        color='#00bbff'
                    />
                    : ''}
                {props.message}
            </div>
        </div>
    );
};

export default List;
