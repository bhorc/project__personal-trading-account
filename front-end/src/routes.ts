import React from 'react';

// pages
import Main from './pages/Main';
import Login from './pages/Login';

// interface
interface Route {
	title: string,
	path: string,
	enabled: boolean,
	component: React.FC
}

export const routes: Array<Route> = [
	{
		title: 'Home',
		path: '/',
		enabled: true,
		component: Main
	},
	{
		title: 'Login',
		path: '/login',
		enabled: true,
		component: Login
	}
]
