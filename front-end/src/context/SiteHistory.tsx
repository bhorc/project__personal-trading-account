import React, {createContext, useState, ReactNode} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {AppContextInterface} from '../types/Types';

export const SimpleCtx = createContext<AppContextInterface>({} as AppContextInterface);

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30;

export const CtxProvider = ({ children }: { children: ReactNode }): JSX.Element => {
	const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs(new Date().getTime() - month));
	const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs(new Date()));

	return <SimpleCtx.Provider value={{ dateTo, setDateTo, dateFrom, setDateFrom }}>{children}</SimpleCtx.Provider>;
};

export default CtxProvider;
