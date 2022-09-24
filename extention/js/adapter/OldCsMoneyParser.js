class OldCsMoneyParser extends DefaultParser{
	constructor() {
		super();
		this.response = {};
		this.items = [];
	}
	async parseInventory(url, origin, cookies){
		return await this.parse(url, origin, cookies);
	}
	async parseHistory(url, origin, cookies){
		this.response = await this.parse(url, origin, cookies);
		// for (let item of solds){
		// 	let {
		// 		appid,
		// 		current_assetid: assetId,
		// 		price: buy_price,
		// 		custom_price: sold_price,
		// 		floatvalue: float,
		// 		patternindex: pattern,
		// 		name_id: nameId,
		// 		method,
		// 		status
		// 	} = item;
		// 	this.items.push({id, name, image, price, date, type, status, tradeid});
		// }
		return this.response.filter(item => item.status.toLowerCase() === 'sold');
	}
}
