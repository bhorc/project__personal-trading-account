import clsx from "clsx";
import React from 'react';
import Icon from "../Icon/Icon";
import {icons} from "../../assets/Assets";

const AsideMenuItem = ({href, iconSrc, caption, isActive = false, className}) => {
    return (
        <a className={clsx(isActive ? 'text-gray-200 bg-gray-700 ' : '', className)} href={href}>
            <Icon className="w-6 h-6" src={iconSrc} />
            {
                caption && <span>{caption}</span>
            }
        </a>
    );
};

export default AsideMenuItem;