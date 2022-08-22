import React from 'react';

const Icon = ({src, ...props}) => {
    return (
        <svg {...props}>
            <use href={src + '#icon'} />
        </svg>
    );
};

export default Icon;