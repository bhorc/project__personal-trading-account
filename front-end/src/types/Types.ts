import {Dayjs} from 'dayjs';

export interface Item {
	_id?: number | object;
	assetId: string;
	exterior: string;
	float: number;
	fullName: string;
	gunType: string;
	iconUrl: string;
	inspectLink: string;
	itemType: string;
	pattern: number;
	rarity: string;
	souvenir: boolean;
	stattrak: boolean;
	stickers: Sticker[];
	tournament: string;
	type: string;
	weaponType: string;
	createdAt: number;
	updatedAt: number;
}

export interface Transaction {
	_id?: number | object;
	location: string;
	status: Status;
	method: Method;
	depositPrice: number;
	buyPrice: number;
	salePrice: number;
	soldPrice: number;
	buyTime: number;
	saleTime: number;
	soldTime: number;
	feeFunds: number;
	feePercent: number;
	createdAt: number;
}

export enum Status {
	sold = 'sold',
	onSale = 'on sale',
	inventory = 'inventory',
	withdrawn = 'withdrawn',
}

export enum Method {
	trade = 'trade',
	deposit = 'deposit',
	auction = 'auction',
}

export interface History {
	_id?: number | object;
	type?: string;
	assetId: string;
	steamId: string;
	transactions: Transaction[];
	statusUpdatedAt: number;
	createdAt: number;
	updatedAt: number;
}

export interface Sticker {
	icon_url: string;
	name: string;
	nameId: number;
	pos: number;
	sticker_price: number;
	wear: number;
}

export interface AppContextInterface {
	dateTo: Dayjs | null;
	setDateTo(value: any): void;
	dateFrom: Dayjs | null;
	setDateFrom(value: any): void;
}
