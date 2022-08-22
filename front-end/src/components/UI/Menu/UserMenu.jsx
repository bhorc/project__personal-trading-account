import React from 'react';
import {icons, images} from "../../assets/Assets";
import Icon from "../Icon/Icon";
import AnimatedIcon from "../Icon/AnimatedIcon";

const UserMenu = () => {
    return (
        <div className="flex flex-shrink-0 items-center h-20 relative">
            <button type="button" className="group relative focus:bg-gray-600 rounded-full">
                <AnimatedIcon icon="bell" className="p-2 text-gray-100 hover:bg-gray-500 hover:text-gray-100 focus:bg-gray-600 rounded-full" />
                <nav className="w-[19.5rem] bg-gray-500 invisible border-gray-800 rounded absolute left-1 top-full transition-all opacity-0 group-focus:visible group-focus:opacity-100 group-focus:translate-y-6">
                    <h3 className="text-left px-3 py-3 text-gray-100 uppercase border-b border-gray-400">Notifications</h3>
                    <a href="#" className="absolute w-6 h-6 right-3 top-3 text-gray-100"><Icon className="w-6 h-6" src={icons.close} /></a>
                    <ul className="font-normal text-gray-100 shadow overflow-hidden rounded py-1 z-20">
                        <li>
                            <a href="#" className="flex items-center text-left flex-wrap px-3 py-3 hover:bg-gray-400">
                                <span className="block basis-3/4 uppercase">Users stalking</span>
                                <span className="flex justify-end basis-1/4 gap-1.5 text-accept-300"><Icon className="w-6 h-6" src={icons.arrowFinanceUp} />2</span>
                                <time className="block basis-1/2 text-gray-200 text-xs">02.07.2022  15:27</time>
                                <span className="block basis-1/2 text-gray-200 text-xs text-right">2 users made changes</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-left flex-wrap px-3 py-3 hover:bg-gray-400">
                                <span className="block basis-3/4 uppercase">Items stalking</span>
                                <span className="flex justify-end basis-1/4 gap-1.5 text-error-300"><Icon className="w-6 h-6" src={icons.arrowFinanceDown} />5</span>
                                <time className="block basis-1/2 text-gray-200 text-xs">05.07.2022  18:42</time>
                                <span className="block basis-1/2 text-gray-200 text-xs text-right">5 users made changes</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-left flex-wrap px-3 py-3 hover:bg-gray-400">
                                <span className="block basis-3/4 uppercase">Lost items stalking</span>
                                <span className="flex justify-end basis-1/4 gap-1.5 text-accept-300"><Icon className="w-6 h-6" src={icons.arrowFinanceUp} />3</span>
                                <time className="block basis-1/2 text-gray-200 text-xs">08.07.2022  11:35</time>
                                <span className="block basis-1/2 text-gray-200 text-xs text-right">3 users made changes</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </button>
            <button type="button" className="group relative ml-3 focus:bg-gray-600 rounded-lg">
                <div className="inline-flex items-center p-2 hover:bg-gray-500 focus:bg-gray-600 rounded-lg">
                    <span className="sr-only">User Menu</span>
                    <span className="h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 overflow-hidden">
                        <img src={images.avatar} alt="avatar" className="h-full w-full object-cover" />
                    </span>
                    <div className="hidden md:flex md:flex-col md:items-start md:leading-tight">
                        <span className="font-semibold text-gray-100">BHORC</span>
                        <span className="text-sm text-gray-100">76561198139995771</span>
                    </div>
                    <Icon className="h-6 w-6 text-gray-300 transition group-focus:rotate-180" src={icons.arrowDown} />
                </div>
                <nav className="w-full invisible border-gray-800 rounded absolute left-0 top-full transition-all opacity-0 group-focus:visible group-focus:opacity-100 group-focus:translate-y-1">
                    <ul className="w-full font-normal bg-gray-500 text-gray-100 shadow overflow-hidden rounded py-1 z-20">
                        <li>
                            <a href="#" className="flex items-center px-3 py-3 hover:bg-gray-400">
                                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 24 24" width="24" height="24" className="text-gray-100">
                                    <path
                                        d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
                                        className="heroicon-ui"></path>
                                </svg>
                                <span className="ml-2">Account</span>
                            </a>
                        </li>
                        <li className="border-b border-gray-400">
                            <a href="#" className="flex items-center px-3 py-3 hover:bg-gray-400">
                                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 24 24" width="24" height="24" className="text-gray-100">
                                    <path
                                        d="M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                                        className="heroicon-ui"></path>
                                </svg>
                                <span className="ml-2">Settings</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center px-3 py-3 hover:bg-gray-400">
                                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24"
                                     height="24" viewBox="0 0 24 24" className="text-gray-100">
                                    <path d="M0 0h24v24H0z" fill="none"></path>
                                    <path
                                        d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                                </svg>
                                <span className="ml-2">Logout</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </button>
        </div>
    );
};

export default UserMenu;