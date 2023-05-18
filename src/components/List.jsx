import React from 'react';
import Article from './Article';
import {ScaleLoader} from "react-spinners";

const List = (props) => {
    return (
        <div className='list'>
            {props.data.map((article, index) => (
                <Article article={article} key={index} />
            ))}
            <div className='message'>
                {props.message.length ? (
                    <ScaleLoader height='20px' width='5px' color='#00bbff' />
                ) : (
                    ''
                )}
                {props.message}
            </div>
        </div>
    );
};

// const List = (props) => {
//
//     console.log(props);
//
//     return (
//         <div className='list'>
//             {props.data.map((article, index) => (
//                 <Article article={article} key={index} />
//             ))}
//             <div className='message'>
//                 {props.message.length ? (
//                     <ScaleLoader height='20px' width='5px' color='#00bbff' />
//                 ) : (
//                     ''
//                 )}
//                 {props.message}
//             </div>
//         </div>
//     );
// };

export default List;
