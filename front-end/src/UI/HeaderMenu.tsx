import React from 'react';
import {AppBar, Badge, Box, IconButton, Toolbar, Typography} from '@mui/material';
import NotificationCenter from '../components/notifications/NotificationCenter';

const HeaderMenu = () => {
	return (
		<AppBar position="fixed" sx={{
			backgroundImage: 'none',
			boxShadow: 'none',
			zIndex: (theme) => theme.zIndex.drawer + 1
		}}>
			<Toolbar disableGutters={true}>
				<Typography variant="h6" noWrap component="div">
					Clipped drawer
				</Typography>
				<Box sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					width: '100%'
				}}>
					<NotificationCenter />
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default HeaderMenu;
