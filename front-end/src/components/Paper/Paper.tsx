import React from 'react';
import {styled, Paper} from '@mui/material';

const myPaper = ({...props}): JSX.Element => {
	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background['gray-500'] : '#fff',
		backgroundImage: 'none',
		...theme.typography.body2,
		padding: theme.spacing(1),
		color: theme.palette.text.secondary,
		borderRadius: '5px'
	}));

	return ( <Item {...props} />);
};

export default myPaper;
