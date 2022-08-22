import React from 'react';
import Icon from "./Icon";
import {icons} from "../../assets/Assets";
import clsx from "clsx";

const AnimatedIcon = ({icon, className, ...props}) => {
    switch (icon) {
        case 'bell':
            return (
                <div className={clsx('relative', className)} {...props}>
                    <span className="sr-only">Notifications</span>
                    <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
                    <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full animate-ping"></span>
                    <Icon className="w-6 h-6" src={icons[icon]} />
                </div>
            )

    }
};

export default AnimatedIcon;