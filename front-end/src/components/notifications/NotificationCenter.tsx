import React, { useState, useEffect } from 'react';
import { useNotificationCenter } from 'react-toastify/addons/use-notification-center';
import { toast, TypeOptions } from 'react-toastify';
import { format } from 'date-fns';
import { Box, IconButton, Stack, Badge, Drawer, Typography, Menu, MenuItem, useTheme, Alert, Toolbar } from '@mui/material';
import {
	Notifications as NotificationsIcon,
	DeleteForever as DeleteForeverIcon,
	MarkAsUnread as MarkAsUnreadIcon,
	Email as EmailIcon,
	Drafts as DraftsIcon,
	MoreVert as MoreVertIcon,
	Add as AddIcon,
} from '@mui/icons-material';

const drawerWidth = '22rem';
const ITEM_HEIGHT = 48;

export default function NotificationCenter(): JSX.Element {
	const { palette } = useTheme();
	const notificationsStorage = JSON.parse(localStorage.getItem('notifications') || '[]');
	const {
		notifications,
		clear,
		markAllAsRead,
		markAsRead,
		unreadCount,
	} = useNotificationCenter({ data: notificationsStorage });

	useEffect(() => {
		if (notifications.length !== 0) {
			localStorage.setItem('notifications', JSON.stringify(notifications));
		}
	}, [notifications]);

	const [showUnreadOnly, setShowUnreadOnly] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const addNotification = () => {
		toast('Lorem ipsum dolor sit amet, consectetur adipiscing elit', {
			type: 'success' as TypeOptions
		});
	};
	const toggleNotificationCenter = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setIsOpen(!isOpen);
	};
	const [anchorPopup, setAnchorPopup] = useState<null | HTMLElement>(null);
	const openPopup = Boolean(anchorPopup);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorPopup(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorPopup(null);
	};
	const clearNotifications = () => {
		localStorage.removeItem('notifications');
		clear();
		handleClose();
	}

	return (
		<>
			<IconButton size="large" onClick={toggleNotificationCenter}>
				<Badge badgeContent={unreadCount} color="primary">
					<NotificationsIcon color="action" />
				</Badge>
			</IconButton>
			<IconButton size="large" onClick={addNotification}>
				<AddIcon color="action" />
			</IconButton>

			<Drawer
				sx={{
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box'
					},
				}}
				variant="temporary"
				anchor="right"
				open={isOpen}
				onClose={() => setIsOpen(false)}
				PaperProps={{
					style: {
						background: palette.background.default,
						border: 'none',
					}
				}}
			>
				<Toolbar />
				<Box sx={{ height: 'calc(100% - 64px * 2)' }}>
					<Box
						sx={{
							height: '64px',
							padding: '8px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<Typography variant="h5" sx={{ color: 'primary.contrastText' }}>
							NOTIFICATIONS
						</Typography>

						<IconButton
							aria-label="more"
							id="long-button"
							sx={{ color: 'primary.contrastText' }}
							aria-controls={openPopup ? 'long-menu' : undefined}
							aria-expanded={openPopup ? 'true' : undefined}
							aria-haspopup="true"
							onClick={handleClick}
						>
							<MoreVertIcon />
						</IconButton>
						<Menu
							id="long-menu"
							MenuListProps={{
								'aria-labelledby': 'long-button',
							}}
							anchorEl={anchorPopup}
							open={openPopup}
							onClose={handleClose}
							PaperProps={{
								style: {
									maxHeight: ITEM_HEIGHT * 4.5,
									width: '20ch',
								},
							}}
						>
							<MenuItem onClick={() => {
								handleClose();
								setShowUnreadOnly(!showUnreadOnly);
							}}>
								{
									showUnreadOnly ? (
										<><EmailIcon/><Typography sx={{marginLeft: '8px'}}>Unread only</Typography></>
									) : (
										<><MarkAsUnreadIcon /><Typography sx={{ marginLeft: '8px' }}>Show all</Typography></>
									)
								}
							</MenuItem>
							<MenuItem onClick={clearNotifications}>
								<DeleteForeverIcon />
								<Typography sx={{ marginLeft: '8px' }}>Delete all</Typography>
							</MenuItem>
							<MenuItem onClick={() => {
								markAllAsRead();
								handleClose();
							}}>
								<DraftsIcon />
								<Typography sx={{ marginLeft: '8px' }}>Mark all as read</Typography>
							</MenuItem>
						</Menu>
					</Box>
					<Stack
						sx={{
							height: '100%',
							overflowY: 'auto'
						}}
					>
						{(!notifications.length ||
							(unreadCount === 0 && showUnreadOnly)) && (
							<Box
								sx={{
									borderTop: '1px solid ' + palette.divider,
									padding: '12px',
									textAlign: 'center'
								}}
							>
								Your queue is empty! you are all set
							</Box>
						)}
						{(showUnreadOnly
								? notifications.filter((v) => !v.read)
								: notifications
						).map((notification): JSX.Element => (
							<Alert
								key={notification.id}
								sx={{
									borderTop: '1px solid ' + palette.divider,
									borderRadius: 0,
									background: palette.background.default,
									color: palette.text.primary,
									padding: '6px 12px'
								}}
								action={
									notification.read ? (
										<IconButton
											color="secondary"
											aria-label="upload picture"
											component="span"
										>
											<DraftsIcon />
										</IconButton>
									) : (
										<IconButton
											color="primary"
											aria-label="upload picture"
											component="span"
											onClick={() => markAsRead(notification.id)}
										>
											<EmailIcon />
										</IconButton>
									)
								}
							>
								{notification.content}
								<Box>
									<Typography
										variant="caption"
										sx={{
											color: palette.text.secondary
										}}
									>
										{format(new Date(notification.createdAt), 'yyyy-MM-dd HH:mm')}
									</Typography>
								</Box>
							</Alert>
						))}
					</Stack>
				</Box>
			</Drawer>
		</>
	);
}
