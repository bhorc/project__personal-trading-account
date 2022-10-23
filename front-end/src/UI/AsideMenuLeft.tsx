import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Link } from 'react-router-dom';

const drawerWidth = '5rem';

const links = [
	{
		title: 'Home',
		path: '/',
	},
	{
		title: 'History',
		path: '/history',
	},
	{
		title: 'About',
		path: '/about',
	},
	{
		title: 'Login',
		path: '/login',
	}
];

export default function ClippedDrawer() {
	return (
		<>
			<CssBaseline />
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					['& .MuiDrawer-paper']: {
						width: drawerWidth,
						boxSizing: 'border-box'
					},
				}}
				PaperProps={{
					style: {
						border: 'none',
					}
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: 'auto' }}>
					<List>
						{links.map(({title, path}, index) => (
							<ListItem key={path} component={Link} to={path} disablePadding>
								<ListItemButton sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									textAlign: 'center',
									color: 'text.primary',
									'&:hover': {
										color: 'action.hover',
										bgcolor: 'transparent',
										'& .MuiListItemIcon-root': {
											color: 'action.hover'
										}
									},
								}}>
									<ListItemIcon sx={{ justifyContent: 'center' }}>
										{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
									</ListItemIcon>
									<ListItemText primary={title} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
		</>
	);
}
