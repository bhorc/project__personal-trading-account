import React from 'react';
import clsx from "clsx";

const PersonalStatistics = ({userStatistics, className, ...props}) => (
    <div {...props} className={clsx("text-gray-100 leading-7 uppercase p-6", className)}>
        {
            Object.entries(userStatistics).map(([key, value]) => (
                <ul className="[&>li]:flex [&>li]:justify-between [&>li:last-child]:border-t mb-5">
                    <h3 className="font-bold text-white">{key}:</h3>
                    {
                        Object.keys(value).map((item, index) => (
                            <li className="pl-3" key={index}>
                                {item}: <span>{value[item].type === 'money' && '$'} {value[item].value}</span>
                            </li>
                        ))
                    }
                </ul>
            ))
        }
    </div>
);

export default PersonalStatistics;