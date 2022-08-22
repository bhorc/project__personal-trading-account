import React from 'react';
import clsx from "clsx";

const HeaderMenuItem = ({children, className, isActive = false, ...props}) => {
    return (
        <a
            {...props}
            className={clsx(
                isActive ? 'border-contrast-300 text-contrast-300 ' : 'border-transparent ',
                className
            )}
        >
            {children}
        </a>
    );
};

export default HeaderMenuItem;