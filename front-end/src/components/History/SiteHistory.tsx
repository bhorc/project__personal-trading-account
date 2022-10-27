import React, {useContext, useEffect, useRef, useState} from 'react';
import { Chip, Typography, Accordion, AccordionDetails, AccordionSummary, Box, TextField, Autocomplete, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { Check as CheckIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import axios from 'axios';
import useAxios, { configure, loadCache, serializeCache } from 'axios-hooks';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Item, History, AppContextInterface } from '../../types/Types';
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
	const [methods, setMethods] = useState<string[]>([]);
	const [status, setStatus] = useState<string[]>([]);
	const [filteredHistories, setFilteredHistories] = useState<typeof histories>([]);
	const [filterSearch, setFilterSearch] = useState<string | null>(null);
	const [filterMethod, setFilterMethod] = useState<typeof methods>([]);
	const [filterState, setFilterState] = useState<typeof status>([]);
	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [{ data, loading, error, response }, refetch] = useAxios({
		url: 'site/getHistories',
		params: {
			domain,
			page,
			sortBy: 'soldTime',
			// 'method[]': filterMethod.length ? filterMethod.join(',') : ['All'],
			// 'status[]': filterState.length ? filterState.join(',') : ['All'],
			dateTo: dateTo?.format('YYYY-MM-DD'),
			dateFrom: dateFrom?.format('YYYY-MM-DD'),
		},
	});

	useEffect(() => {
		if (data?.data) {
			const { items = [], histories = [] } = data.data;
			setItems(prevItems => [...prevItems, ...items]);
			setHistories(prevHistories => [...prevHistories, ...histories]);
			setMethods(Array.from(new Set(histories.map((item: History) => item.method))));
			setStatus(Array.from(new Set(histories.map((item: History) => item.status))));
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
	}, [dateFrom, dateTo]);

	useEffect(() => {
		const filteredHistory = histories.filter(({ assetId, status, method }) => {
			const { fullName = '' } = items.find((item) => item.assetId === assetId) || {};
			return (
				(!filterSearch || fullName.toLowerCase().includes(filterSearch.toLowerCase()))
				&& (!filterMethod.length || filterMethod.includes(method))
				&& (!filterState.length || filterState.includes(status))
			);
		});
		setFilteredHistories(filteredHistory);
	}, [histories, filterSearch, filterMethod, filterState]);

	const [expanded, setExpanded] = useState<string | false>(false);
	const handleChangeAccordion =
		(expanded: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? expanded : false);
		};

	const handleChangeSelect =
		(setState: React.Dispatch<React.SetStateAction<string[]>>) => ({ target }: SelectChangeEvent<string[]>) => {
			setState(typeof target.value === 'string' ? target.value.split(',') : target.value);
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
					options={items.map(({fullName}) => fullName)}
					renderInput={(params) => <TextField {...params} label="Search" />}
				/>
				<FormControl size="small" sx={{ flexGrow: 5, flexBasis: 0 }}>
					<InputLabel id="SelectMethod-label">Method</InputLabel>
					<Select
						labelId="SelectMethod-label"
						id="SelectMethod-select"
						multiple
						value={filterMethod}
						onChange={handleChangeSelect(setFilterMethod)}
						input={<OutlinedInput label="Method" />}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}
					>
						{methods.map((method) => (
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
						value={filterState}
						onChange={handleChangeSelect(setFilterState)}
						input={<OutlinedInput label="State" />}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}
					>
						{status.map((method) => (
							<MenuItem key={method} value={method}>
								<Checkbox checked={filterState.indexOf(method) > -1} />
								<ListItemText primary={method} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
			<Box id="scrollableContainer" sx={{ overflowY: 'scroll', overflowX: 'hidden' }} display="flex" flexDirection="column" gap="6px">
				<InfiniteScroll
					dataLength={filteredHistories.length}
					next={() => setPage(prevPage => prevPage + 1)}
					hasMore={histories.length < totalCount}
					scrollableTarget="scrollableContainer"
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
					style={{ overflow: 'hidden' }}
				>
					{
						filteredHistories.map((history: History, index: number, array) => {
							const prevHistory = array[index - 1];
							const { soldTime: prevSoldTime, buyTime: prevBuyTime } = prevHistory || {};
							const { assetId, status, method, buyPrice, buyTime, salePrice, soldPrice, soldTime, feeFunds	} = history;
							const { fullName,	iconUrl } = items.find((item: Item) => item.assetId === assetId) as Item || {};
							const updatedTime = new Date(soldTime || buyTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
							const updatedDate = new Date(soldTime || buyTime).toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'});
							const prevUpdatedDate = new Date(prevSoldTime || prevBuyTime).toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'});
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
