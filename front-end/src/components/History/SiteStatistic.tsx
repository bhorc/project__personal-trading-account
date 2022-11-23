import { Box, Grid, TextField, Typography } from '@mui/material';
import React, {useContext} from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Statistics } from '../../types/Types';
import { SimpleCtx } from '../../context/SiteHistory';

const SiteStatistic = ({statistics}: { statistics: Statistics }) => {
	const { dateTo, setDateTo, dateFrom, setDateFrom } = useContext(SimpleCtx);

	return (
		<Grid container justifyContent="center" columnSpacing={2} rowSpacing={1}>
			<Grid item xs={5.5}>
				<Typography variant="subtitle2" component="h2" sx={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'text.hint', lineHeight: '26px' }}>
					Statistics for the period:
				</Typography>
			</Grid>
			<Grid item xs={5.5}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Box sx={{ display: 'flex' }}>
						<MobileDatePicker
							inputFormat="DD.MM.YYYY"
							value={dateFrom}
							onChange={setDateFrom}
							InputProps={{disableUnderline: true}}
							renderInput={(params) => (
								<TextField
									variant="standard"
									hiddenLabel
									size="small"
									sx={{
										width: '105px',
										height: '26px',
										borderRadius: '6px',
										overflow: 'hidden',
										border: 'none',
										bgcolor: 'background.gray-300',
										input: {
											lineHeight: '26px',
											color: 'text.hint',
											fontWeight: 'bold',
											p: '3px 0',
											textAlign: 'center',
											fontSize: '14px',
										}
									}}
									{...params}
								/>
							)}
						/>
						<Typography variant="subtitle2" component="h2" sx={{ m: '0 8px' }}>
							–
						</Typography>
						<MobileDatePicker
							inputFormat="DD.MM.YYYY"
							mask="__.__.__"
							value={dateTo}
							onChange={setDateTo}
							InputProps={{disableUnderline: true}}
							renderInput={(params) => (
								<TextField
									variant="standard"
									hiddenLabel
									size="small"
									sx={{
										width: '105px',
										height: '26px',
										borderRadius: '6px',
										overflow: 'hidden',
										border: 'none',
										bgcolor: 'background.gray-300',
										input: {
											lineHeight: '26px',
											color: 'text.hint',
											fontWeight: 'bold',
											p: '3px 0',
											textAlign: 'center',
											fontSize: '14px',
										}
									}}
									{...params}
								/>
							)}
						/>
					</Box>
				</LocalizationProvider>
			</Grid>
			<Grid item xs={5.5}>
				<Typography variant="subtitle2" component="h2" sx={{ textTransform: 'uppercase', lineHeight: '26px', pl: 1 }}>
					<Grid container justifyContent="space-between">
						<span>Purchased items:</span>
						<span>$ {statistics.buyPrice} / {statistics.buyCount}</span>
					</Grid>
					<Grid container justifyContent="space-between">
						<span>Listed items:</span>
						<span>$ {statistics.salePrice} / {statistics.saleCount}</span>
					</Grid>
					<Grid container justifyContent="space-between">
						<span>Sold items:</span>
						<span>$ {statistics.soldPrice} / {statistics.soldCount}</span>
					</Grid>
				</Typography>
			</Grid>
			<Grid item xs={5.5}>
				<Typography variant="subtitle2" component="h2" sx={{ textTransform: 'uppercase', lineHeight: '26px' }}>
					<Grid container justifyContent="space-between">
						<span>Current Profit:</span>
						<span>$ {statistics.profit}</span>
					</Grid>
					<Grid container justifyContent="space-between">
						<span>Expected profit:</span>
						<span>$ {statistics.expectedProfit}</span>
					</Grid>
					<Grid container justifyContent="space-between">
						<span>Commission paid:</span>
						<span>$ {statistics.commission}</span>
					</Grid>
				</Typography>
			</Grid>
		</Grid>
	);
};

export default SiteStatistic;
