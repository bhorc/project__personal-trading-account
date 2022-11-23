import React from 'react';
import { Box } from '@mui/material';
import AsideMenuLeft from '../UI/AsideMenuLeft';
import AsideMenuRight from '../UI/AsideMenuRight';
import HeaderMenu from '../UI/HeaderMenu';
import SiteHistory from '../components/History/SiteHistory';
import CtxProvider from '../context/SiteHistory';

const sites = [
	'old.cs.money',
	'buff.163.com',
	'steamcommunity.com',
];

const Main = () => {
	return (
		<CtxProvider>
			<Box sx={{ display: 'flex', height: '100%' }}>
				<HeaderMenu />
				<AsideMenuLeft />
				<Box sx={{ width: '100%', height: 'calc(100vh - 64px)', p: '6px', mt: '64px', borderRadius: '5px', bgcolor: 'background.gray-600' }}>
					<Box component="main" sx={{ height: '100%', flexGrow: 1 }} display="flex" gap="6px">
						{sites ? sites.map((domain) => (
								<SiteHistory key={domain} domain={domain} />
						)) : null}
					</Box>
				</Box>
				<AsideMenuRight />
			</Box>
		</CtxProvider>
	);
};

export default Main;
