import React from 'react';
import {icons, images} from '../../assets/Assets.js';
import AsideMenuItem from "./AsideMenuItem";

const AsideMenu = () => {
    const Links = [
        {href: '/', iconSrc: icons.home, caption: 'home', isActive: true},
        {href: '/search', iconSrc: icons.search, caption: 'search', isActive: false},
        {href: '/diagram', iconSrc: icons.diagram, caption: 'diagram', isActive: false},
        {href: '/files', iconSrc: icons.files, caption: 'files', isActive: false},
        {href: '/basket', iconSrc: icons.basket, caption: 'basket', isActive: false},
        {href: '/settings', iconSrc: icons.settings, caption: 'settings', isActive: false},
        {href: '/chat', iconSrc: icons.chat, caption: 'chat', isActive: false},
    ];

    return (
        <div className="flex flex-col items-center w-20 h-screen pb-3 overflow-hidden text-gray-400">
            <a className="flex items-center justify-center mt-3" href="#">
                <img className="w-16 h-16" src={icons.logo} alt=""/>
            </a>
            <menu className="flex flex-col items-center mt-3 border-t border-gray-700">
                {Links.map(({href, iconSrc, caption, isActive}, index) => {
                    return (
                        <AsideMenuItem
                            key={caption}
                            href={href}
                            iconSrc={iconSrc}
                            caption={caption}
                            isActive={isActive}
                            className="flex flex-col items-center justify-center h-12 mt-4 font-bold text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                        />
                    );
                })}
            </menu>
            <AsideMenuItem
                key='user'
                href='/user'
                iconSrc={icons.user}
                caption='user'
                isActive={false}
                className="flex flex-col items-center justify-center h-16 mt-auto font-bold text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            />
        </div>
    );
};

export default AsideMenu;