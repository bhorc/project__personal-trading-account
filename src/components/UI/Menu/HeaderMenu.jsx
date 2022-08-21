import React from 'react';
import HeaderMenuItem from "./HeaderMenuItem";

const HeaderMenu = () => {
    const Links = [
        {href: '/Users', children: 'Users', isActive: true},
        {href: '/Company', children: 'Company', isActive: false},
        {href: '/Expense', children: 'Expense', isActive: false},
        {href: '/Exchange', children: 'Exchange', isActive: false},
    ];

    return (
        <menu className="flex h-20 pl-6 text-gray-100 dark:text-gray-400">
            {Links.map(({href, children, isActive}, index) => (
                <HeaderMenuItem
                    key={href}
                    href={href}
                    isActive={isActive}
                    className="cursor-pointer px-2 h-full border-t-4 inline-flex mr-4 items-center text-gray-200 font-semibold hover:text-contrast-300 hover:border-contrast-300"
                >
                    {children}
                </HeaderMenuItem>
            ))}
        </menu>
    );
};

export default HeaderMenu;