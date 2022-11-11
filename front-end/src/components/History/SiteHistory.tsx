import React, {useContext, useEffect, useState} from 'react';
import { Chip, Typography, Box, TextField, Autocomplete, CircularProgress, FormControl, InputLabel, MenuItem, Select, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { Check as CheckIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import axios from 'axios';
import useAxios, { configure, loadCache, serializeCache } from 'axios-hooks';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Item, History, Transaction, AppContextInterface, Status, Method } from '../../types/Types';
import { Accordion, AccordionSummary, AccordionDetails } from '../Accordion/Accordion';
import MyPaper from '../Paper/Paper';
import SiteStatistic from './SiteStatistic';
import { SimpleCtx } from '../../context/SiteHistory';

const instance = axios.create({
	withCredentials: true,
	baseURL: 'http://localhost:3001/api/',
});
configure({
	axios: instance,
	defaultOptions: {
		useCache: false,
	}
});
// loadCache(JSON.parse(localStorage.getItem('cache') || '[]'));

const MenuProps = {
	PaperProps: {
		style: {
			width: 200,
		},
	},
};

const SiteHistory = ({ domain }: { domain: string }) => {
	const { dateTo, dateFrom } = useContext<AppContextInterface>(SimpleCtx);
	const [items, setItems] = useState<Item[]>([]);
	const [histories, setHistories] = useState<History[]>([]);
	const [filteredHistories, setFilteredHistories] = useState<typeof histories>([]);
	const [filterSearch, setFilterSearch] = useState<string | null>(null);
	const [filterMethod, setFilterMethod] = useState<Method[]>([]);
	const [filterStatus, setFilterStatus] = useState<Status[]>([]);
	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [{ data, loading, error, response }, refetch] = useAxios({
		url: 'site/getHistories',
		params: {
			domain,
			page,
			'method[]': filterMethod.length ? filterMethod.join(',') : ['All'],
			'status[]': filterStatus.length ? filterStatus.join(',') : ['All'],
			dateTo: dateTo?.format('YYYY-MM-DD'),
			dateFrom: dateFrom?.format('YYYY-MM-DD'),
		},
	});

	useEffect(() => {
		if (data?.data) {
			const { items = [], histories = [] } = data.data;
			setItems(prevItems => [...prevItems, ...items]);
			setHistories(prevHistories => [...prevHistories, ...histories]);
			setTotalCount(Number(response?.headers['x-total-count']));
			// serializeCache().then((cache) => {
			// 	localStorage.setItem('cache', JSON.stringify(cache));
			// });
		}
	}, [data]);

	useEffect(() => {
		setPage(0);
		setItems([]);
		setHistories([]);
	}, [dateFrom, dateTo, filterMethod, filterStatus]);

	useEffect(() => {
		const filteredHistory = histories.filter(({ assetId }) => {
			const { fullName = '' } = items.find((item) => item.assetId === assetId) || {};
			return !filterSearch || fullName.toLowerCase().includes(filterSearch.toLowerCase());
		});
		setFilteredHistories(filteredHistory);
	}, [histories, filterSearch]);

	const [expanded, setExpanded] = useState<string | false>(false);
	const handleChangeAccordion =
		(expanded: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? expanded : false);
		};

	return (
		<Box sx={{ height: '100%', flexDirection: 'column'}} display="flex" gap="6px">
			<MyPaper>
				<SiteStatistic histories={histories} />
			</MyPaper>
			<Box display="flex" gap="6px">
				<Autocomplete
					freeSolo
					size="small"
					value={filterSearch}
					onChange={(event: any, newValue: string | null) => {
						setFilterSearch(newValue);
					}}
					sx={{ flexGrow: 12, flexBasis: 0 }}
					options={Array.from(new Set(items.map((item) => item.fullName)))}
					renderInput={(params) => <TextField {...params} label="Search" />}
				/>
				<FormControl size="small" sx={{ flexGrow: 5, flexBasis: 0 }}>
					<InputLabel id="SelectMethod-label">Method</InputLabel>
					<Select
						labelId="SelectMethod-label"
						id="SelectMethod-select"
						multiple
						value={filterMethod}
						onChange={({ target }) => setFilterMethod(target.value as Method[])}
						input={<OutlinedInput label="Method" />}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}
					>
						{Object.values(Method).map((method) => (
							<MenuItem key={method} value={method}>
								<Checkbox checked={filterMethod.indexOf(method) > -1} />
								<ListItemText primary={method} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl size="small" sx={{ flexGrow: 5, flexBasis: 0 }}>
					<InputLabel id="SelectState-label">State</InputLabel>
					<Select
						labelId="SelectState-label"
						id="SelectState-select"
						multiple
						value={filterStatus}
						onChange={({ target }) => setFilterStatus(target.value as Status[])}
						input={<OutlinedInput label="State" />}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}
					>
						{Object.values(Status).map((status) => (
							<MenuItem key={status} value={status}>
								<Checkbox checked={filterStatus.indexOf(status) > -1} />
								<ListItemText primary={status} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
			<Box id={domain} sx={{ overflowY: 'scroll', overflowX: 'hidden' }} display="flex" flexDirection="column">
				<InfiniteScroll
					dataLength={filteredHistories.length}
					next={() => setPage(prevPage => prevPage + 1)}
					hasMore={histories.length < totalCount}
					scrollableTarget={domain}
					loader={
						<Box display='flex' justifyContent='center'>
							<CircularProgress />
						</Box>
					}
					endMessage={
						<p style={{ textAlign: 'center' }}>
							<b>Yay! You have seen it all</b>
						</p>
					}
					style={{
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
						paddingRight: '6px',
					}}
				>
					{
						filteredHistories.map(({ assetId, transactions, statusUpdatedAt }: History, index: number, array) => {
							const { status, method, buyPrice, salePrice, soldPrice, feeFunds } = Object.assign({}, ...transactions) as Transaction;
							const prevHistory = array[index - 1] || {};
							const { statusUpdatedAt: prevStatusUpdatedAt } = prevHistory;
							const { fullName,	iconUrl } = items.find((item: Item) => item.assetId === assetId) as Item || {};
							const updatedTime = new Date(statusUpdatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
							const updatedDate = new Date(statusUpdatedAt).toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'});
							const prevUpdatedDate = new Date(prevStatusUpdatedAt).toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'});
							const profit = soldPrice - buyPrice - feeFunds;
							const isProfitable = profit > 0;
							return (
								<React.Fragment key={assetId}>
									{
										prevUpdatedDate !== updatedDate && (
											<Typography variant="subtitle2">
												{updatedDate}
											</Typography>
										)
									}
									<Accordion expanded={expanded === assetId} onChange={handleChangeAccordion(assetId)}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												p: '0 6px 0 12px',
												'& > *': {
													alignItems: 'center',
													justifyContent: 'space-between',
												}
											}}
										>
											<Typography variant="subtitle2" sx={{ width: '2.25rem' }}>{updatedTime}</Typography>
											<Typography variant="subtitle2" sx={{ width: '5.65rem' }}>
												<Chip
													size="small"
													color="success"
													label={method}
													icon={<CheckIcon />}
												/>
											</Typography>
											<Typography variant="subtitle2" sx={{ width: '3.75rem', color: 'error.main' }}>
												{buyPrice ? `$${buyPrice}` : 'null'}
											</Typography>
											<Box sx={{ width: '40px', height: '40px', backgroundColor: 'background.gray-700', borderRadius: '0.25rem' }}>
												<img
													src={`https://community.akamai.steamstatic.com/economy/image/${iconUrl}`}
													alt={fullName}
													style={{ width: '100%', height: '100%', objectFit: 'contain' }}
													loading="lazy"
												/>
											</Box>
											<Typography variant="subtitle2" sx={{ width: '3.75rem', color: 'primary.main' }}>
												{salePrice ? `$ ${salePrice}` : ''}
											</Typography>
											<Typography variant="subtitle2" sx={{ width: '5rem', color: isProfitable ? 'success.main' : 'error.main' }}>
												{status === 'sold' ? (isProfitable ? '+' : '-') + ` $ ${Math.abs(profit).toFixed(2)}` : ''}
											</Typography>
											<Typography variant="subtitle2" sx={{ width: '6.65rem' }}>
												<Chip
													size="small"
													color="success"
													label={status}
													icon={<CheckIcon />}
												/>
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography>
												Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
												Aliquam eget maximus est, id dignissim quam.
											</Typography>
										</AccordionDetails>
									</Accordion>
								</React.Fragment>
							);
						})
					}
				</InfiniteScroll>
			</Box>
		</Box>
	);
};

export default SiteHistory;
